/**
 * Station API Load Tests
 * 
 * Tests the behavior of the Station API under high load to ensure
 * scalability and stability.
 * 
 * JRMB-2025-005-API: Station API Endpoints Implementation
 * 
 * @jest-environment node
 */

import { describe, expect, it, jest, beforeEach, afterAll } from '@jest/globals';
import { StationController } from '../../../src/backend/api/controllers/station.controller';
import { Request, Response } from 'express';
import { mockRequest, mockResponse } from '../../mocks/express.mock';

// Mock the station service
jest.mock('../../../src/backend/api/services/station.service');

// Set longer timeout for load tests
jest.setTimeout(60000); // 60 seconds

// Performance metrics tracking
interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  minResponseTime: number;
  maxResponseTime: number;
  avgResponseTime: number;
  p95ResponseTime: number;  // 95th percentile
  p99ResponseTime: number;  // 99th percentile
  totalDuration: number;
  requestsPerSecond: number;
}

// Performance thresholds
const LOAD_TEST_THRESHOLDS = {
  MIN_REQUESTS_PER_SECOND: 50,
  MAX_AVG_RESPONSE_TIME_MS: 200,
  MAX_P95_RESPONSE_TIME_MS: 500,
  MAX_P99_RESPONSE_TIME_MS: 800,
  MAX_ERROR_RATE_PERCENT: 1.0
};

/**
 * Calculates percentile value from an array of numbers
 */
function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const index = Math.ceil(percentile / 100 * sortedValues.length) - 1;
  return sortedValues[index];
}

describe('Station API Load Tests', () => {
  let stationController: StationController;
  let stationService: any;
  
  // Timing logs for metrics calculations
  let timingLogs: number[] = [];
  
  // Performance metrics capture
  let metrics: PerformanceMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    minResponseTime: Number.MAX_SAFE_INTEGER,
    maxResponseTime: 0,
    avgResponseTime: 0,
    p95ResponseTime: 0,
    p99ResponseTime: 0,
    totalDuration: 0,
    requestsPerSecond: 0
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    stationController = new StationController();
    stationService = require('../../../src/backend/api/services/station.service').StationService.prototype;
    
    // Reset metrics for each test
    timingLogs = [];
    metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      minResponseTime: Number.MAX_SAFE_INTEGER,
      maxResponseTime: 0,
      avgResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      totalDuration: 0,
      requestsPerSecond: 0
    };
  });
  
  afterAll(() => {
    // Suppress console output for load tests except summary metrics
    const originalConsoleLog = console.log;
    console.log = (message) => {
      if (message && typeof message === 'string' && message.includes('LOAD TEST METRICS')) {
        originalConsoleLog(message);
      }
    };
  });
  
  // Helper function to calculate performance metrics
  const calculateMetrics = (responseTimes: number[], totalDuration: number): PerformanceMetrics => {
    const total = responseTimes.reduce((sum, time) => sum + time, 0);
    
    return {
      totalRequests: metrics.totalRequests,
      successfulRequests: metrics.successfulRequests,
      failedRequests: metrics.failedRequests,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      avgResponseTime: total / responseTimes.length,
      p95ResponseTime: calculatePercentile(responseTimes, 95),
      p99ResponseTime: calculatePercentile(responseTimes, 99),
      totalDuration,
      requestsPerSecond: metrics.totalRequests / (totalDuration / 1000)
    };
  };
  
  // Helper function to log performance metrics
  const logPerformanceMetrics = (metrics: PerformanceMetrics, testName: string) => {
    console.log('\n----- LOAD TEST METRICS: ' + testName + ' -----');
    console.log(`Total Requests: ${metrics.totalRequests}`);
    console.log(`Successful Requests: ${metrics.successfulRequests}`);
    console.log(`Failed Requests: ${metrics.failedRequests}`);
    console.log(`Error Rate: ${(metrics.failedRequests / metrics.totalRequests * 100).toFixed(2)}%`);
    console.log(`Min Response Time: ${metrics.minResponseTime.toFixed(2)}ms`);
    console.log(`Max Response Time: ${metrics.maxResponseTime.toFixed(2)}ms`);
    console.log(`Avg Response Time: ${metrics.avgResponseTime.toFixed(2)}ms`);
    console.log(`95th Percentile: ${metrics.p95ResponseTime.toFixed(2)}ms`);
    console.log(`99th Percentile: ${metrics.p99ResponseTime.toFixed(2)}ms`);
    console.log(`Total Duration: ${metrics.totalDuration.toFixed(2)}ms`);
    console.log(`Throughput: ${metrics.requestsPerSecond.toFixed(2)} req/sec`);
    console.log('------------------------------------------\n');
  };
  
  describe('High Volume Station Search Tests', () => {
    // Mock data for all load tests
    const mockStaticStations = Array.from({ length: 100 }, (_, index) => ({
      id: `station-${index}`,
      name: `Test Station ${index}`,
      address: {
        street: `${index} Test Street`,
        city: 'New York',
        state: 'NY',
        postalCode: `1000${index % 10}`,
        country: 'USA'
      },
      location: {
        type: 'Point',
        coordinates: [-73.9857 + (index * 0.001), 40.7484 + (index * 0.001)]
      },
      capacity: 20 + (index % 10),
      availableBikes: 5 + (index % 15),
      status: index % 20 === 0 ? 'maintenance' : 'active'
    }));
    
    it('should handle high volume of concurrent station listing requests', async () => {
      // Arrange
      const concurrentUsers = 100;
      const listingRequests = [];
      
      // Mock response for getStations
      stationService.getStations.mockImplementation((options) => {
        // Simulate processing time 10-30ms
        const processingTime = Math.floor(Math.random() * 20) + 10;
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Extract pagination options
            const page = options.page || 1;
            const limit = options.limit || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            
            // Get page of stations
            const paginatedStations = mockStaticStations.slice(startIndex, endIndex);
            
            // Return paginated response
            resolve({
              data: paginatedStations,
              metadata: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: mockStaticStations.length,
                totalPages: Math.ceil(mockStaticStations.length / limit),
                hasNextPage: endIndex < mockStaticStations.length,
                hasPrevPage: page > 1
              }
            });
          }, processingTime);
        });
      });
      
      // Prepare concurrent requests with different pagination
      for (let i = 0; i < concurrentUsers; i++) {
        const req = mockRequest();
        const res = mockResponse();
        const page = (i % 10) + 1; // Pages 1-10
        
        req.query = {
          page: page.toString(),
          limit: '10',
          status: i % 3 === 0 ? 'active' : undefined
        };
        
        // Track metrics for this request
        const requestPromise = (async () => {
          metrics.totalRequests++;
          
          const startTime = Date.now();
          try {
            await stationController.getStations(req as Request, res as Response, jest.fn());
            const duration = Date.now() - startTime;
            
            // Record success and timing
            metrics.successfulRequests++;
            timingLogs.push(duration);
            
            // Update min/max response time directly
            metrics.minResponseTime = Math.min(metrics.minResponseTime, duration);
            metrics.maxResponseTime = Math.max(metrics.maxResponseTime, duration);
            
            return {
              success: true,
              status: res.status.mock.calls[0]?.[0] || 0,
              duration
            };
          } catch (error) {
            const duration = Date.now() - startTime;
            
            // Record failure but still track timing
            metrics.failedRequests++;
            timingLogs.push(duration);
            
            return {
              success: false,
              error,
              duration
            };
          }
        })();
        
        listingRequests.push(requestPromise);
      }
      
      // Act - Execute all requests
      const startTime = Date.now();
      const results = await Promise.all(listingRequests);
      const totalDuration = Date.now() - startTime;
      
      // Calculate metrics
      const finalMetrics = calculateMetrics(timingLogs, totalDuration);
      logPerformanceMetrics(finalMetrics, 'Station Listing Load Test');
      
      // Assert - Verify performance meets requirements
      expect(finalMetrics.requestsPerSecond).toBeGreaterThanOrEqual(LOAD_TEST_THRESHOLDS.MIN_REQUESTS_PER_SECOND);
      expect(finalMetrics.avgResponseTime).toBeLessThanOrEqual(LOAD_TEST_THRESHOLDS.MAX_AVG_RESPONSE_TIME_MS);
      expect(finalMetrics.p95ResponseTime).toBeLessThanOrEqual(LOAD_TEST_THRESHOLDS.MAX_P95_RESPONSE_TIME_MS);
      expect(finalMetrics.p99ResponseTime).toBeLessThanOrEqual(LOAD_TEST_THRESHOLDS.MAX_P99_RESPONSE_TIME_MS);
      
      // Check error rate
      const errorRate = (finalMetrics.failedRequests / finalMetrics.totalRequests) * 100;
      expect(errorRate).toBeLessThanOrEqual(LOAD_TEST_THRESHOLDS.MAX_ERROR_RATE_PERCENT);
    });
    
    it('should handle high volume of search and filter operations', async () => {
      // Arrange
      const concurrentUsers = 100;
      const searchRequests = [];
      
      // List of various search filters to simulate diverse user queries
      const searchFilters = [
        { status: 'active' },
        { status: 'maintenance' },
        { minCapacity: '20', maxCapacity: '30' },
        { minAvailableBikes: '5' },
        { city: 'New York' },
        { bikeType: 'electric' },
        { bikeType: 'mountain' },
        { keyword: 'Station' }
      ];
      
      // Mock response for advancedSearch
      stationService.advancedSearch.mockImplementation((searchParams) => {
        // Simulate processing time 20-50ms based on complexity
        const baseTime = 20;
        // More complex filters take longer
        const filterComplexity = Object.keys(searchParams).length * 5;
        const processingTime = baseTime + filterComplexity + (Math.random() * 10);
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Filter stations based on search params
            // This is a simplified mock that returns random stations
            const resultCount = Math.min(Math.floor(Math.random() * 30) + 1, mockStaticStations.length);
            const filteredStations = mockStaticStations.slice(0, resultCount);
            
            resolve({
              results: filteredStations,
              metadata: {
                totalResults: filteredStations.length,
                searchParams
              }
            });
          }, processingTime);
        });
      });
      
      // Prepare concurrent search requests with different filters
      for (let i = 0; i < concurrentUsers; i++) {
        const req = mockRequest();
        const res = mockResponse();
        
        // Select random filter combination
        const selectedFilters = searchFilters[i % searchFilters.length];
        req.query = { ...selectedFilters };
        
        // Track metrics for this request
        const requestPromise = (async () => {
          metrics.totalRequests++;
          
          const startTime = Date.now();
          try {
            await stationController.advancedSearch(req as Request, res as Response, jest.fn());
            const duration = Date.now() - startTime;
            
            // Record success and timing
            metrics.successfulRequests++;
            timingLogs.push(duration);
            
            // Update min/max response time directly
            metrics.minResponseTime = Math.min(metrics.minResponseTime, duration);
            metrics.maxResponseTime = Math.max(metrics.maxResponseTime, duration);
            
            return {
              success: true,
              status: res.status.mock.calls[0]?.[0] || 0,
              duration
            };
          } catch (error) {
            const duration = Date.now() - startTime;
            
            // Record failure but still track timing
            metrics.failedRequests++;
            timingLogs.push(duration);
            
            return {
              success: false,
              error,
              duration
            };
          }
        })();
        
        searchRequests.push(requestPromise);
      }
      
      // Act - Execute all requests
      const startTime = Date.now();
      const results = await Promise.all(searchRequests);
      const totalDuration = Date.now() - startTime;
      
      // Calculate metrics
      const finalMetrics = calculateMetrics(timingLogs, totalDuration);
      logPerformanceMetrics(finalMetrics, 'Station Search Load Test');
      
      // Assert - Verify performance meets requirements
      expect(finalMetrics.requestsPerSecond).toBeGreaterThanOrEqual(LOAD_TEST_THRESHOLDS.MIN_REQUESTS_PER_SECOND);
      expect(finalMetrics.avgResponseTime).toBeLessThanOrEqual(LOAD_TEST_THRESHOLDS.MAX_AVG_RESPONSE_TIME_MS);
      expect(finalMetrics.p95ResponseTime).toBeLessThanOrEqual(LOAD_TEST_THRESHOLDS.MAX_P95_RESPONSE_TIME_MS);
      expect(finalMetrics.p99ResponseTime).toBeLessThanOrEqual(LOAD_TEST_THRESHOLDS.MAX_P99_RESPONSE_TIME_MS);
      
      // Check error rate
      const errorRate = (finalMetrics.failedRequests / finalMetrics.totalRequests) * 100;
      expect(errorRate).toBeLessThanOrEqual(LOAD_TEST_THRESHOLDS.MAX_ERROR_RATE_PERCENT);
    });
    
    it('should withstand sustained load over time', async () => {
      // Arrange
      const testDurationMs = 5000; // 5 seconds of sustained load
      const requestsPerSecond = 20; // Target request rate
      const searchRequests = [];
      
      // Mock response with variable timing
      stationService.getStations.mockImplementation(() => {
        // Base processing time plus small random variation
        const processingTime = 20 + (Math.random() * 15);
        
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              data: mockStaticStations.slice(0, 10),
              metadata: {
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: mockStaticStations.length,
                totalPages: Math.ceil(mockStaticStations.length / 10),
                hasNextPage: true,
                hasPrevPage: false
              }
            });
          }, processingTime);
        });
      });
      
      // Execute requests at a steady rate
      const startTime = Date.now();
      let currentTime = startTime;
      let requestIndex = 0;
      
      // Create request executor function
      const executeRequest = async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.query = { page: '1', limit: '10' };
        
        metrics.totalRequests++;
        const requestStartTime = Date.now();
        
        try {
          await stationController.getStations(req as Request, res as Response, jest.fn());
          const duration = Date.now() - requestStartTime;
          
          // Record success and timing
          metrics.successfulRequests++;
          timingLogs.push(duration);
          
          // Update min/max response time directly
          metrics.minResponseTime = Math.min(metrics.minResponseTime, duration);
          metrics.maxResponseTime = Math.max(metrics.maxResponseTime, duration);
          
          return { success: true, duration };
        } catch (error) {
          const duration = Date.now() - requestStartTime;
          
          // Record failure but still track timing
          metrics.failedRequests++;
          timingLogs.push(duration);
          
          return { success: false, error, duration };
        }
      };
      
      // Run requests until test duration is reached
      while (currentTime - startTime < testDurationMs) {
        // Calculate how many requests we should have sent by now
        const elapsedSeconds = (currentTime - startTime) / 1000;
        const targetRequestCount = Math.floor(elapsedSeconds * requestsPerSecond);
        
        // Send requests to catch up to our target rate
        while (requestIndex < targetRequestCount) {
          searchRequests.push(executeRequest());
          requestIndex++;
        }
        
        // Small pause to avoid tight loop
        await new Promise(resolve => setTimeout(resolve, 10));
        currentTime = Date.now();
      }
      
      // Wait for all requests to complete
      const results = await Promise.all(searchRequests);
      const totalDuration = Date.now() - startTime;
      
      // Calculate metrics
      const finalMetrics = calculateMetrics(timingLogs, totalDuration);
      logPerformanceMetrics(finalMetrics, 'Sustained Load Test');
      
      // Assert - Verify sustained performance
      expect(finalMetrics.requestsPerSecond).toBeGreaterThanOrEqual(requestsPerSecond * 0.9); // Allow 10% margin
      expect(finalMetrics.p95ResponseTime).toBeLessThanOrEqual(LOAD_TEST_THRESHOLDS.MAX_P95_RESPONSE_TIME_MS);
      
      // Verify consistent performance over time (no degradation)
      // Split timing logs into first half and second half to compare
      const halfwayPoint = Math.floor(timingLogs.length / 2);
      const firstHalfTimes = timingLogs.slice(0, halfwayPoint);
      const secondHalfTimes = timingLogs.slice(halfwayPoint);
      
      const firstHalfAvg = firstHalfTimes.reduce((sum, time) => sum + time, 0) / firstHalfTimes.length;
      const secondHalfAvg = secondHalfTimes.reduce((sum, time) => sum + time, 0) / secondHalfTimes.length;
      
      // Second half should not be more than 20% slower than first half
      const degradationRate = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;
      expect(degradationRate).toBeLessThanOrEqual(0.2);
    });
  });
});