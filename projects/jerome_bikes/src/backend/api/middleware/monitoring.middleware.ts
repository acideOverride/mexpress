/**
 * API Monitoring Middleware
 * Collects performance metrics and health data for API endpoints
 */
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';
import os from 'os';
import logger from '../utils/logger';
import { env } from '../../../shared/config/env';

// Store metrics data
let metrics = {
  requestCount: 0,
  successCount: 0,
  errorCount: 0,
  requestsPerEndpoint: new Map<string, number>(),
  responseTimeSum: 0,
  responseTimeCounts: new Map<string, { sum: number; count: number }>(),
  lastRequestTime: Date.now(),
  startupTime: Date.now(),
};

// Reset metrics every hour in production to avoid memory leaks
if (env.isProduction) {
  setInterval(() => {
    metrics = {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      requestsPerEndpoint: new Map<string, number>(),
      responseTimeSum: 0,
      responseTimeCounts: new Map<string, { sum: number; count: number }>(),
      lastRequestTime: Date.now(),
      startupTime: metrics.startupTime,
    };
  }, 60 * 60 * 1000); // 1 hour
}

/**
 * Calculate system health metrics
 * @returns Object with health metrics
 */
export const getHealthMetrics = () => {
  const uptime = Math.floor((Date.now() - metrics.startupTime) / 1000);
  const memoryUsage = process.memoryUsage();
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const memoryUsagePercentage = 100 - (freeMem / totalMem) * 100;
  const cpuUsage = os.loadavg()[0]; // 1 minute load average
  const cpuCount = os.cpus().length;
  const cpuUsagePercentage = (cpuUsage / cpuCount) * 100;
  
  // Calculate average response time
  const averageResponseTime = metrics.requestCount > 0
    ? metrics.responseTimeSum / metrics.requestCount
    : 0;
  
  // Calculate requests per second
  const requestsPerSecond = metrics.requestCount / (uptime || 1);
  
  // Get per-endpoint metrics
  const endpointMetrics = Array.from(metrics.responseTimeCounts.entries()).map(([endpoint, data]) => ({
    endpoint,
    count: data.count,
    averageResponseTime: data.count > 0 ? data.sum / data.count : 0,
  }));
  
  // Get top 5 endpoints by request count
  const topEndpoints = Array.from(metrics.requestsPerEndpoint.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([endpoint, count]) => ({ endpoint, count }));
  
  return {
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString(),
    system: {
      memory: {
        free: freeMem,
        total: totalMem,
        used: totalMem - freeMem,
        usagePercentage: memoryUsagePercentage.toFixed(2),
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
      },
      cpu: {
        count: cpuCount,
        loadAverage: os.loadavg(),
        usagePercentage: cpuUsagePercentage.toFixed(2),
      },
    },
    requests: {
      total: metrics.requestCount,
      success: metrics.successCount,
      error: metrics.errorCount,
      successRate: metrics.requestCount > 0
        ? (metrics.successCount / metrics.requestCount * 100).toFixed(2)
        : '0.00',
      averageResponseTime: averageResponseTime.toFixed(2),
      requestsPerSecond: requestsPerSecond.toFixed(2),
      lastRequest: new Date(metrics.lastRequestTime).toISOString(),
    },
    endpoints: {
      top: topEndpoints,
      metrics: endpointMetrics,
    },
  };
};

/**
 * Request monitoring middleware
 * Collects metrics for each API request
 */
export const monitorRequest = (req: Request, res: Response, next: NextFunction) => {
  // Skip monitoring for health and metrics endpoints
  if (req.path === '/api/health' || req.path === '/api/metrics') {
    return next();
  }
  
  // Record request start time
  const startTime = performance.now();
  
  // Track request count
  metrics.requestCount++;
  metrics.lastRequestTime = Date.now();
  
  // Track requests per endpoint
  const endpoint = req.method + ' ' + req.path;
  const currentEndpointCount = metrics.requestsPerEndpoint.get(endpoint) || 0;
  metrics.requestsPerEndpoint.set(endpoint, currentEndpointCount + 1);
  
  // Track response status and time
  const originalSend = res.send;
  res.send = function(body) {
    // Calculate response time
    const responseTime = performance.now() - startTime;
    
    // Track response time
    metrics.responseTimeSum += responseTime;
    
    // Track response time per endpoint
    const endpointData = metrics.responseTimeCounts.get(endpoint) || { sum: 0, count: 0 };
    endpointData.sum += responseTime;
    endpointData.count++;
    metrics.responseTimeCounts.set(endpoint, endpointData);
    
    // Track success/error counts
    if (res.statusCode >= 200 && res.statusCode < 400) {
      metrics.successCount++;
    } else {
      metrics.errorCount++;
    }
    
    // Log slow responses (over 1000ms) in development/staging
    if (responseTime > 1000 && !env.isProduction) {
      logger.warn(`Slow response: ${endpoint} took ${responseTime.toFixed(2)}ms`, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        responseTime,
      });
    }
    
    // Call original send method
    return originalSend.call(this, body);
  };
  
  next();
};

/**
 * API metrics endpoint handler
 * Returns current monitoring metrics
 */
export const getMetrics = (req: Request, res: Response) => {
  res.json(getHealthMetrics());
};