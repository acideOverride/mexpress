/**
 * Load Balancer Service implementation
 * Fixes for MEXP-2025-007-BE Integration Architecture P3 Tests
 */
import { EventEmitter } from 'events';

/**
 * Backend service health state
 */
export enum ServiceHealth {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  DEGRADED = 'degraded',
  UNKNOWN = 'unknown'
}

/**
 * Load balancing algorithms
 */
export enum LoadBalancingAlgorithm {
  ROUND_ROBIN = 'round-robin',
  LEAST_CONNECTIONS = 'least-connections',
  WEIGHTED = 'weighted',
  STICKY_SESSION = 'sticky-session',
  IP_HASH = 'ip-hash',
  RANDOM = 'random',
  LEAST_RESPONSE_TIME = 'least-response-time'
}

/**
 * Backend service configuration
 */
export interface BackendService {
  id: string;
  name: string;
  url: string;
  weight: number;
  maxConnections: number;
  currentConnections: number;
  healthCheckPath: string;
  healthCheckInterval: number;
  healthStatus: ServiceHealth;
  lastHealthCheck: Date;
  responseTime: number;
  failureCount: number;
  successCount: number;
  drainMode: boolean;
  region?: string;
  zone?: string;
  tags?: string[];
  metadata?: Record<string, string>;
}

export interface ServiceRequest {
  id: string;
  clientIp?: string;
  sessionId?: string;
  path: string;
  method: string;
  headers: Record<string, string>;
  timestamp: Date;
  priority?: number;
  metadata?: Record<string, any>;
}

export interface ServiceResponse {
  id: string;
  requestId: string;
  serviceId: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  headers: Record<string, string>;
  error?: Error;
  metadata?: Record<string, any>;
}

export interface HealthCheckResult {
  serviceId: string;
  status: ServiceHealth;
  timestamp: Date;
  responseTime: number;
  statusCode?: number;
  error?: Error;
}

export interface LoadBalancerRule {
  id: string;
  name: string;
  pathPattern?: string | RegExp;
  methodPattern?: string | RegExp;
  headerRules?: { header: string; pattern: string | RegExp }[];
  clientIpPattern?: string | RegExp;
  priority: number;
  targetServices: string[];
  algorithm: LoadBalancingAlgorithm;
  stickySession?: boolean;
  weight?: Record<string, number>;
  enabled: boolean;
}

export interface TrafficSplitRule {
  id: string;
  name: string;
  percentage: Record<string, number>;
  enabled: boolean;
}

export interface LoadBalancerStats {
  requests: {
    total: number;
    success: number;
    failure: number;
    inProgress: number;
  };
  services: {
    total: number;
    healthy: number;
    unhealthy: number;
    degraded: number;
  };
  responseTime: {
    average: number;
    p95: number;
    p99: number;
  };
  connections: {
    current: number;
    max: number;
  };
}

export interface LoadBalancerOptions {
  healthCheckInterval?: number;
  healthCheckTimeout?: number;
  defaultAlgorithm?: LoadBalancingAlgorithm;
  maxRetries?: number;
  retryDelay?: number;
  connectionTimeout?: number;
  drainTimeout?: number;
  failoverEnabled?: boolean;
  metricsEnabled?: boolean;
}

/**
 * Enhanced Load Balancer Service
 * Provides advanced load balancing with health checks, traffic distribution, and failover
 */
export class LoadBalancerService extends EventEmitter {
  private services: Map<string, BackendService>;
  private rules: Map<string, LoadBalancerRule>;
  private trafficSplitRules: Map<string, TrafficSplitRule>;
  private sessionAffinity: Map<string, string>; // sessionId -> serviceId
  private requestStats: Map<string, number>; // serviceId -> requestCount
  private healthCheckInterval: number;
  private healthCheckTimeout: number;
  private defaultAlgorithm: LoadBalancingAlgorithm;
  private maxRetries: number;
  private retryDelay: number;
  private connectionTimeout: number;
  private drainTimeout: number;
  private failoverEnabled: boolean;
  private metricsEnabled: boolean;
  private roundRobinIndex: number;
  private healthCheckTimer?: NodeJS.Timeout;
  private stats: LoadBalancerStats;
  private responseTimeHistory: number[];
  private maxResponseTimeHistory: number;

  /**
   * Create a new load balancer service
   */
  constructor(options: LoadBalancerOptions = {}) {
    super();
    
    this.services = new Map();
    this.rules = new Map();
    this.trafficSplitRules = new Map();
    this.sessionAffinity = new Map();
    this.requestStats = new Map();
    this.healthCheckInterval = options.healthCheckInterval || 30000; // 30 seconds
    this.healthCheckTimeout = options.healthCheckTimeout || 5000; // 5 seconds
    this.defaultAlgorithm = options.defaultAlgorithm || LoadBalancingAlgorithm.ROUND_ROBIN;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000; // 1 second
    this.connectionTimeout = options.connectionTimeout || 10000; // 10 seconds
    this.drainTimeout = options.drainTimeout || 60000; // 60 seconds
    this.failoverEnabled = options.failoverEnabled !== undefined ? options.failoverEnabled : true;
    this.metricsEnabled = options.metricsEnabled !== undefined ? options.metricsEnabled : true;
    this.roundRobinIndex = 0;
    this.responseTimeHistory = [];
    this.maxResponseTimeHistory = 1000; // Store last 1000 response times
    
    // Initialize stats
    this.stats = {
      requests: {
        total: 0,
        success: 0,
        failure: 0,
        inProgress: 0
      },
      services: {
        total: 0,
        healthy: 0,
        unhealthy: 0,
        degraded: 0
      },
      responseTime: {
        average: 0,
        p95: 0,
        p99: 0
      },
      connections: {
        current: 0,
        max: 0
      }
    };
    
    // Start health checks if needed
    this.startHealthChecks();
  }

  /**
   * Register a backend service
   */
  registerService(service: Omit<BackendService, 'healthStatus' | 'lastHealthCheck' | 'responseTime' | 'failureCount' | 'successCount' | 'currentConnections'>): BackendService {
    const newService: BackendService = {
      ...service,
      healthStatus: ServiceHealth.UNKNOWN,
      lastHealthCheck: new Date(0), // Unix epoch
      responseTime: 0,
      failureCount: 0,
      successCount: 0,
      currentConnections: 0
    };
    
    this.services.set(service.id, newService);
    this.requestStats.set(service.id, 0);
    
    // Update service stats
    this.stats.services.total = this.services.size;
    
    this.emit('service.registered', {
      serviceId: service.id,
      serviceName: service.name
    });
    
    // Trigger an immediate health check for this service
    this.checkServiceHealth(newService);
    
    return newService;
  }

  /**
   * Deregister a backend service
   */
  deregisterService(serviceId: string): boolean {
    const exists = this.services.has(serviceId);
    
    if (!exists) {
      return false;
    }
    
    // Put service in drain mode before removing
    this.drainService(serviceId);
    
    // Wait for connections to drain
    setTimeout(() => {
      this.services.delete(serviceId);
      this.requestStats.delete(serviceId);
      
      // Update service stats
      this.stats.services.total = this.services.size;
      this.recalculateHealthStats();
      
      this.emit('service.deregistered', {
        serviceId
      });
    }, this.drainTimeout);
    
    return true;
  }

  /**
   * Set a service to drain mode (no new connections)
   */
  drainService(serviceId: string): boolean {
    const service = this.services.get(serviceId);
    
    if (!service) {
      return false;
    }
    
    service.drainMode = true;
    
    this.emit('service.drain', {
      serviceId,
      connections: service.currentConnections
    });
    
    return true;
  }

  /**
   * Add a load balancer rule
   */
  addRule(rule: Omit<LoadBalancerRule, 'id'>): LoadBalancerRule {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const newRule: LoadBalancerRule = {
      ...rule,
      id
    };
    
    this.rules.set(id, newRule);
    
    this.emit('rule.added', {
      ruleId: id,
      ruleName: rule.name
    });
    
    return newRule;
  }

  /**
   * Remove a load balancer rule
   */
  removeRule(ruleId: string): boolean {
    const exists = this.rules.has(ruleId);
    
    if (!exists) {
      return false;
    }
    
    this.rules.delete(ruleId);
    
    this.emit('rule.removed', {
      ruleId
    });
    
    return true;
  }

  /**
   * Add a traffic split rule
   */
  addTrafficSplitRule(rule: Omit<TrafficSplitRule, 'id'>): TrafficSplitRule {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const newRule: TrafficSplitRule = {
      ...rule,
      id
    };
    
    // Validate percentages add up to 100
    const total = Object.values(rule.percentage).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.1) {
      throw new Error(`Traffic split percentages must add up to 100%, got ${total}%`);
    }
    
    this.trafficSplitRules.set(id, newRule);
    
    this.emit('trafficSplit.added', {
      ruleId: id,
      ruleName: rule.name
    });
    
    return newRule;
  }

  /**
   * Remove a traffic split rule
   */
  removeTrafficSplitRule(ruleId: string): boolean {
    const exists = this.trafficSplitRules.has(ruleId);
    
    if (!exists) {
      return false;
    }
    
    this.trafficSplitRules.delete(ruleId);
    
    this.emit('trafficSplit.removed', {
      ruleId
    });
    
    return true;
  }

  /**
   * Route a request to an appropriate backend service
   */
  async routeRequest(request: ServiceRequest): Promise<ServiceResponse> {
    // Update stats
    this.stats.requests.total++;
    this.stats.requests.inProgress++;
    this.stats.connections.current++;
    this.stats.connections.max = Math.max(this.stats.connections.max, this.stats.connections.current);
    
    // Create a service response with the request ID
    const response: ServiceResponse = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      requestId: request.id,
      serviceId: '',
      statusCode: 0,
      responseTime: 0,
      timestamp: new Date(),
      headers: {}
    };
    
    try {
      // Find a matching rule
      const rule = this.findMatchingRule(request);
      
      // Find a backend service to handle the request
      const service = await this.selectBackendService(request, rule);
      
      if (!service) {
        throw new Error('No available backend services');
      }
      
      // Track the selected service
      response.serviceId = service.id;
      
      // Simulate sending request to backend service
      const startTime = Date.now();
      const result = await this.sendRequestToBackend(request, service);
      const endTime = Date.now();
      
      // Update response
      response.statusCode = result.statusCode;
      response.responseTime = endTime - startTime;
      response.headers = result.headers;
      
      // Track response time
      this.addResponseTime(response.responseTime);
      
      // Update service metrics
      service.responseTime = (service.responseTime * 0.7) + (response.responseTime * 0.3); // Weighted average
      service.successCount++;
      
      // Update stats
      this.stats.requests.success++;
      
      // Update session affinity if needed
      if (rule && rule.stickySession && request.sessionId) {
        this.sessionAffinity.set(request.sessionId, service.id);
      }
      
      // Success
      return response;
    } catch (error) {
      // Handle error
      if (error instanceof Error) {
        response.error = error;
        response.statusCode = 500;
      }
      
      // Update stats
      this.stats.requests.failure++;
      
      // Return failure response
      return response;
    } finally {
      // Update active connections
      this.stats.requests.inProgress--;
      this.stats.connections.current--;
      
      // Reduce connections on the service if one was selected
      if (response.serviceId) {
        const service = this.services.get(response.serviceId);
        if (service) {
          service.currentConnections = Math.max(0, service.currentConnections - 1);
        }
      }
    }
  }

  /**
   * Find a matching load balancer rule for the request
   */
  private findMatchingRule(request: ServiceRequest): LoadBalancerRule | null {
    // Get all enabled rules
    const enabledRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority); // Sort by priority (higher first)
    
    // Find first matching rule
    for (const rule of enabledRules) {
      let matches = true;
      
      // Check path pattern
      if (rule.pathPattern && !this.matchesPattern(request.path, rule.pathPattern)) {
        matches = false;
        continue;
      }
      
      // Check method pattern
      if (rule.methodPattern && !this.matchesPattern(request.method, rule.methodPattern)) {
        matches = false;
        continue;
      }
      
      // Check header rules
      if (rule.headerRules) {
        for (const headerRule of rule.headerRules) {
          const headerValue = request.headers[headerRule.header];
          if (!headerValue || !this.matchesPattern(headerValue, headerRule.pattern)) {
            matches = false;
            break;
          }
        }
        
        if (!matches) {
          continue;
        }
      }
      
      // Check client IP pattern
      if (rule.clientIpPattern && request.clientIp && !this.matchesPattern(request.clientIp, rule.clientIpPattern)) {
        matches = false;
        continue;
      }
      
      // Rule matches
      if (matches) {
        return rule;
      }
    }
    
    // No matching rule
    return null;
  }

  /**
   * Check if a value matches a pattern
   */
  private matchesPattern(value: string, pattern: string | RegExp): boolean {
    if (pattern instanceof RegExp) {
      return pattern.test(value);
    } else {
      // Simple glob-like pattern matching (supports * wildcard)
      const regexPattern = pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
        .replace(/\*/g, '.*'); // Convert * to .*
      
      return new RegExp(`^${regexPattern}$`).test(value);
    }
  }

  /**
   * Select a backend service for the request
   */
  private async selectBackendService(request: ServiceRequest, rule: LoadBalancerRule | null): Promise<BackendService | null> {
    // Handle session affinity if present
    if (request.sessionId && this.sessionAffinity.has(request.sessionId)) {
      const serviceId = this.sessionAffinity.get(request.sessionId)!;
      const service = this.services.get(serviceId);
      
      // Use session affinity if service is healthy and not in drain mode
      if (service && service.healthStatus === ServiceHealth.HEALTHY && !service.drainMode) {
        service.currentConnections++;
        return service;
      } else {
        // Clear invalid session affinity
        this.sessionAffinity.delete(request.sessionId);
      }
    }
    
    // Get healthy services
    let availableServices = Array.from(this.services.values())
      .filter(service => service.healthStatus === ServiceHealth.HEALTHY && !service.drainMode);
    
    // Filter by rule if present
    if (rule && rule.targetServices.length > 0) {
      availableServices = availableServices.filter(service => 
        rule.targetServices.includes(service.id)
      );
    }
    
    // Check if traffic split is enabled
    const trafficSplitRules = Array.from(this.trafficSplitRules.values())
      .filter(rule => rule.enabled);
    
    if (trafficSplitRules.length > 0) {
      // Use the first enabled traffic split rule
      const splitRule = trafficSplitRules[0];
      
      // Group services by category (from traffic split rule)
      const servicesByCategory: Record<string, BackendService[]> = {};
      
      for (const service of availableServices) {
        // Determine service category (use tags, region, or other attributes)
        let category = service.tags?.[0] || service.region || 'default';
        
        // Only use categories defined in the traffic split rule
        if (!splitRule.percentage[category]) {
          category = 'default';
        }
        
        if (!servicesByCategory[category]) {
          servicesByCategory[category] = [];
        }
        
        servicesByCategory[category].push(service);
      }
      
      // Generate a random number between 0 and 100
      const rand = Math.random() * 100;
      
      // Select a category based on the random number and percentage weights
      let cumulativePercentage = 0;
      let selectedCategory = 'default';
      
      for (const [category, percentage] of Object.entries(splitRule.percentage)) {
        cumulativePercentage += percentage;
        
        if (rand <= cumulativePercentage) {
          selectedCategory = category;
          break;
        }
      }
      
      // Get services for the selected category
      const servicesInCategory = servicesByCategory[selectedCategory] || [];
      
      // If no services in the selected category, use any available service
      if (servicesInCategory.length === 0) {
        servicesInCategory.push(...availableServices);
      }
      
      // Select a service from the category
      if (servicesInCategory.length > 0) {
        const algorithm = rule?.algorithm || this.defaultAlgorithm;
        const service = this.selectServiceByAlgorithm(servicesInCategory, algorithm, rule);
        
        if (service) {
          service.currentConnections++;
          return service;
        }
      }
    } else {
      // No traffic split, use regular selection
      if (availableServices.length > 0) {
        const algorithm = rule?.algorithm || this.defaultAlgorithm;
        const service = this.selectServiceByAlgorithm(availableServices, algorithm, rule);
        
        if (service) {
          service.currentConnections++;
          return service;
        }
      }
    }
    
    // If no healthy services are available and failover is enabled, try degraded services
    if (this.failoverEnabled) {
      const degradedServices = Array.from(this.services.values())
        .filter(service => service.healthStatus === ServiceHealth.DEGRADED && !service.drainMode);
      
      // Filter by rule if present
      const availableDegraded = rule && rule.targetServices.length > 0
        ? degradedServices.filter(service => rule.targetServices.includes(service.id))
        : degradedServices;
      
      if (availableDegraded.length > 0) {
        const algorithm = rule?.algorithm || this.defaultAlgorithm;
        const service = this.selectServiceByAlgorithm(availableDegraded, algorithm, rule);
        
        if (service) {
          service.currentConnections++;
          this.emit('service.failover', {
            serviceId: service.id,
            status: service.healthStatus
          });
          return service;
        }
      }
    }
    
    // No available services
    return null;
  }

  /**
   * Select a service using the specified algorithm
   */
  private selectServiceByAlgorithm(services: BackendService[], algorithm: LoadBalancingAlgorithm, rule: LoadBalancerRule | null): BackendService | null {
    if (services.length === 0) {
      return null;
    }
    
    switch (algorithm) {
      case LoadBalancingAlgorithm.ROUND_ROBIN:
        return this.selectByRoundRobin(services);
      
      case LoadBalancingAlgorithm.LEAST_CONNECTIONS:
        return this.selectByLeastConnections(services);
      
      case LoadBalancingAlgorithm.WEIGHTED:
        return this.selectByWeighted(services, rule);
      
      case LoadBalancingAlgorithm.RANDOM:
        return this.selectByRandom(services);
      
      case LoadBalancingAlgorithm.LEAST_RESPONSE_TIME:
        return this.selectByLeastResponseTime(services);
      
      default:
        return this.selectByRoundRobin(services);
    }
  }

  /**
   * Select a service using round-robin algorithm
   */
  private selectByRoundRobin(services: BackendService[]): BackendService {
    this.roundRobinIndex = (this.roundRobinIndex + 1) % services.length;
    return services[this.roundRobinIndex];
  }

  /**
   * Select a service with the least active connections
   */
  private selectByLeastConnections(services: BackendService[]): BackendService {
    return services.reduce((min, service) => 
      service.currentConnections < min.currentConnections ? service : min
    );
  }

  /**
   * Select a service based on weighted distribution
   */
  private selectByWeighted(services: BackendService[], rule: LoadBalancerRule | null): BackendService {
    // Calculate total weight
    let totalWeight = 0;
    
    // Use weights from rule if available
    const weights = new Map<string, number>();
    
    for (const service of services) {
      let weight = service.weight;
      
      // Override with rule-specific weight if available
      if (rule && rule.weight && rule.weight[service.id] !== undefined) {
        weight = rule.weight[service.id];
      }
      
      weights.set(service.id, weight);
      totalWeight += weight;
    }
    
    // Select a random point in the total weight
    const random = Math.random() * totalWeight;
    
    // Find the service corresponding to the random point
    let cumulativeWeight = 0;
    
    for (const service of services) {
      cumulativeWeight += weights.get(service.id) || 0;
      
      if (random <= cumulativeWeight) {
        return service;
      }
    }
    
    // Fallback to the last service (should never happen unless weights are invalid)
    return services[services.length - 1];
  }

  /**
   * Select a service randomly
   */
  private selectByRandom(services: BackendService[]): BackendService {
    const randomIndex = Math.floor(Math.random() * services.length);
    return services[randomIndex];
  }

  /**
   * Select a service with the lowest response time
   */
  private selectByLeastResponseTime(services: BackendService[]): BackendService {
    return services.reduce((min, service) => 
      service.responseTime < min.responseTime ? service : min
    );
  }

  /**
   * Simulate sending a request to a backend service
   */
  private async sendRequestToBackend(request: ServiceRequest, service: BackendService): Promise<{ statusCode: number; headers: Record<string, string> }> {
    // In a real implementation, this would make an HTTP request to the backend service
    // Here we just simulate success or failure based on service health
    
    // Track request count for this service
    const currentCount = this.requestStats.get(service.id) || 0;
    this.requestStats.set(service.id, currentCount + 1);
    
    // Simulate network delay based on service response time
    const delay = service.responseTime + Math.random() * 50;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate occasional failures based on service health
    if (service.healthStatus === ServiceHealth.DEGRADED) {
      if (Math.random() < 0.2) { // 20% failure rate for degraded services
        throw new Error(`Backend service error: ${service.id}`);
      }
    }
    
    // Return successful response
    return {
      statusCode: 200,
      headers: {
        'x-backend-id': service.id,
        'x-response-time': delay.toString()
      }
    };
  }

  /**
   * Start health check timer
   */
  private startHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    
    this.healthCheckTimer = setInterval(() => {
      this.checkAllServicesHealth();
    }, this.healthCheckInterval);
    
    // Perform initial health check
    this.checkAllServicesHealth();
  }

  /**
   * Check health for all registered services
   */
  private async checkAllServicesHealth(): Promise<void> {
    for (const service of this.services.values()) {
      this.checkServiceHealth(service);
    }
  }

  /**
   * Check health for a specific service
   */
  private async checkServiceHealth(service: BackendService): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    const result: HealthCheckResult = {
      serviceId: service.id,
      status: ServiceHealth.UNKNOWN,
      timestamp: new Date(),
      responseTime: 0
    };
    
    try {
      // In a real implementation, this would make an HTTP request to the health check endpoint
      // Here we just simulate success or failure
      
      // 50% chance for the first check to succeed
      const firstCheck = service.successCount === 0 && service.failureCount === 0;
      const shouldSucceed = firstCheck ? Math.random() < 0.5 : Math.random() < 0.9;
      
      if (!shouldSucceed) {
        throw new Error('Health check failed');
      }
      
      // Simulate network delay
      const delay = 50 + Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Success
      result.status = ServiceHealth.HEALTHY;
      result.responseTime = Date.now() - startTime;
      result.statusCode = 200;
      
      // Update service
      service.healthStatus = ServiceHealth.HEALTHY;
      service.lastHealthCheck = new Date();
      service.responseTime = result.responseTime;
      service.successCount++;
      service.failureCount = 0;
    } catch (error) {
      // Failure
      result.status = ServiceHealth.UNHEALTHY;
      result.responseTime = Date.now() - startTime;
      result.statusCode = 503;
      
      if (error instanceof Error) {
        result.error = error;
      }
      
      // Update service
      service.failureCount++;
      
      // Determine health status based on failure count
      if (service.failureCount >= 3) {
        service.healthStatus = ServiceHealth.UNHEALTHY;
      } else if (service.failureCount > 0) {
        service.healthStatus = ServiceHealth.DEGRADED;
      }
      
      service.lastHealthCheck = new Date();
    }
    
    // Emit health check event
    this.emit('health.check', result);
    
    // Update health stats
    this.recalculateHealthStats();
    
    return result;
  }

  /**
   * Add a response time measurement and recalculate metrics
   */
  private addResponseTime(responseTime: number): void {
    if (!this.metricsEnabled) {
      return;
    }
    
    this.responseTimeHistory.push(responseTime);
    
    // Limit the size of the history array
    if (this.responseTimeHistory.length > this.maxResponseTimeHistory) {
      this.responseTimeHistory.shift();
    }
    
    // Recalculate response time metrics
    this.recalculateResponseTimeMetrics();
  }

  /**
   * Recalculate response time metrics (average, p95, p99)
   */
  private recalculateResponseTimeMetrics(): void {
    if (this.responseTimeHistory.length === 0) {
      this.stats.responseTime.average = 0;
      this.stats.responseTime.p95 = 0;
      this.stats.responseTime.p99 = 0;
      return;
    }
    
    // Calculate average
    const sum = this.responseTimeHistory.reduce((acc, time) => acc + time, 0);
    this.stats.responseTime.average = sum / this.responseTimeHistory.length;
    
    // Calculate percentiles
    const sorted = [...this.responseTimeHistory].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    const p99Index = Math.floor(sorted.length * 0.99);
    
    this.stats.responseTime.p95 = sorted[p95Index] || 0;
    this.stats.responseTime.p99 = sorted[p99Index] || 0;
  }

  /**
   * Recalculate health statistics
   */
  private recalculateHealthStats(): void {
    let healthy = 0;
    let unhealthy = 0;
    let degraded = 0;
    
    for (const service of this.services.values()) {
      switch (service.healthStatus) {
        case ServiceHealth.HEALTHY:
          healthy++;
          break;
        case ServiceHealth.UNHEALTHY:
          unhealthy++;
          break;
        case ServiceHealth.DEGRADED:
          degraded++;
          break;
      }
    }
    
    this.stats.services.healthy = healthy;
    this.stats.services.unhealthy = unhealthy;
    this.stats.services.degraded = degraded;
  }

  /**
   * Get current load balancer statistics
   */
  getStats(): LoadBalancerStats {
    return { ...this.stats };
  }

  /**
   * Get request distribution across services
   */
  getRequestDistribution(): Record<string, number> {
    const result: Record<string, number> = {};
    
    for (const [serviceId, count] of this.requestStats.entries()) {
      const service = this.services.get(serviceId);
      if (service) {
        result[service.name] = count;
      }
    }
    
    return result;
  }

  /**
   * Clean up resources
   */
  shutdown(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = undefined;
    }
    
    this.removeAllListeners();
    this.services.clear();
    this.rules.clear();
    this.trafficSplitRules.clear();
    this.sessionAffinity.clear();
    this.requestStats.clear();
  }
}