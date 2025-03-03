/**
 * Load Balancer Tests
 * MEXP-2025-007-BE Integration Architecture P3 Tests
 */
import { 
  LoadBalancerService, 
  ServiceHealth, 
  LoadBalancingAlgorithm, 
  BackendService 
} from '../../../src/services/load-balancer';

describe('LoadBalancerService', () => {
  let loadBalancer: LoadBalancerService;
  
  beforeEach(() => {
    loadBalancer = new LoadBalancerService({
      healthCheckInterval: 100, // Fast for tests
      healthCheckTimeout: 100,
      drainTimeout: 100
    });
  });
  
  afterEach(() => {
    loadBalancer.shutdown();
  });
  
  describe('Service Registration', () => {
    test('should register a service successfully', () => {
      const service: Omit<BackendService, 'healthStatus' | 'lastHealthCheck' | 'responseTime' | 'failureCount' | 'successCount' | 'currentConnections'> = {
        id: 'service-1',
        name: 'api-service',
        url: 'http://api:8080',
        weight: 10,
        maxConnections: 100,
        healthCheckPath: '/health',
        healthCheckInterval: 5000,
        drainMode: false
      };
      
      const registeredService = loadBalancer.registerService(service);
      
      expect(registeredService.id).toBe('service-1');
      expect(registeredService.name).toBe('api-service');
      expect(registeredService.url).toBe('http://api:8080');
      expect(registeredService.weight).toBe(10);
      expect(registeredService.maxConnections).toBe(100);
      expect(registeredService.healthStatus).toBe(ServiceHealth.UNKNOWN);
      expect(registeredService.lastHealthCheck).toBeDefined();
      expect(registeredService.responseTime).toBe(0);
      expect(registeredService.failureCount).toBe(0);
      expect(registeredService.successCount).toBe(0);
      expect(registeredService.currentConnections).toBe(0);
      expect(registeredService.drainMode).toBe(false);
    });
    
    test('should deregister a service successfully', async () => {
      // Register a service
      const service = {
        id: 'service-deregister',
        name: 'to-be-deregistered',
        url: 'http://service:8080',
        weight: 10,
        maxConnections: 100,
        healthCheckPath: '/health',
        healthCheckInterval: 5000,
        drainMode: false
      };
      
      loadBalancer.registerService(service);
      
      // Deregister
      const result = loadBalancer.deregisterService('service-deregister');
      expect(result).toBe(true);
      
      // Wait for the drain timeout
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Get distribution (should not include the deregistered service)
      const distribution = loadBalancer.getRequestDistribution();
      expect(distribution['to-be-deregistered']).toBeUndefined();
    });
    
    test('should set a service to drain mode', () => {
      // Register a service
      const service = {
        id: 'service-drain',
        name: 'to-be-drained',
        url: 'http://service:8080',
        weight: 10,
        maxConnections: 100,
        healthCheckPath: '/health',
        healthCheckInterval: 5000,
        drainMode: false
      };
      
      loadBalancer.registerService(service);
      
      // Set to drain mode
      const result = loadBalancer.drainService('service-drain');
      expect(result).toBe(true);
      
      // Get stats
      const stats = loadBalancer.getStats();
      expect(stats.services.total).toBe(1);
    });
  });
  
  describe('Load Balancing Rules', () => {
    test('should add a load balancer rule successfully', () => {
      const rule = {
        name: 'api-rule',
        pathPattern: '/api/*',
        methodPattern: 'GET',
        priority: 10,
        targetServices: ['service-a', 'service-b'],
        algorithm: LoadBalancingAlgorithm.ROUND_ROBIN,
        enabled: true
      };
      
      const addedRule = loadBalancer.addRule(rule);
      
      expect(addedRule.id).toBeDefined();
      expect(addedRule.name).toBe('api-rule');
      expect(addedRule.pathPattern).toBe('/api/*');
      expect(addedRule.methodPattern).toBe('GET');
      expect(addedRule.priority).toBe(10);
      expect(addedRule.targetServices).toEqual(['service-a', 'service-b']);
      expect(addedRule.algorithm).toBe(LoadBalancingAlgorithm.ROUND_ROBIN);
      expect(addedRule.enabled).toBe(true);
    });
    
    test('should remove a rule successfully', () => {
      // Add a rule
      const rule = {
        name: 'temp-rule',
        pathPattern: '/temp/*',
        priority: 5,
        targetServices: ['service-x'],
        algorithm: LoadBalancingAlgorithm.RANDOM,
        enabled: true
      };
      
      const addedRule = loadBalancer.addRule(rule);
      
      // Remove rule
      const result = loadBalancer.removeRule(addedRule.id);
      expect(result).toBe(true);
    });
    
    test('should add a traffic split rule successfully', () => {
      const rule = {
        name: 'region-split',
        percentage: {
          'us-east': 70,
          'eu-west': 30
        },
        enabled: true
      };
      
      const addedRule = loadBalancer.addTrafficSplitRule(rule);
      
      expect(addedRule.id).toBeDefined();
      expect(addedRule.name).toBe('region-split');
      expect(addedRule.percentage).toEqual({
        'us-east': 70,
        'eu-west': 30
      });
      expect(addedRule.enabled).toBe(true);
    });
    
    test('should reject traffic split rule with invalid percentages', () => {
      const rule = {
        name: 'invalid-split',
        percentage: {
          'us-east': 70,
          'eu-west': 40 // Total 110%, should be rejected
        },
        enabled: true
      };
      
      expect(() => loadBalancer.addTrafficSplitRule(rule)).toThrow();
    });
    
    test('should remove a traffic split rule successfully', () => {
      // Add a rule
      const rule = {
        name: 'temp-split',
        percentage: {
          'region-a': 50,
          'region-b': 50
        },
        enabled: true
      };
      
      const addedRule = loadBalancer.addTrafficSplitRule(rule);
      
      // Remove rule
      const result = loadBalancer.removeTrafficSplitRule(addedRule.id);
      expect(result).toBe(true);
    });
  });
  
  describe('Request Routing', () => {
    beforeEach(() => {
      // Register some services for routing tests
      for (let i = 1; i <= 3; i++) {
        loadBalancer.registerService({
          id: `routing-service-${i}`,
          name: 'routing-service',
          url: `http://service${i}:8080`,
          weight: 10,
          maxConnections: 100,
          healthCheckPath: '/health',
          healthCheckInterval: 5000,
          drainMode: false
        });
      }
    });
    
    test('should route requests successfully', async () => {
      const request = {
        id: 'req-1',
        path: '/api/users',
        method: 'GET',
        headers: {},
        timestamp: new Date()
      };
      
      const response = await loadBalancer.routeRequest(request);
      
      expect(response.id).toBeDefined();
      expect(response.requestId).toBe('req-1');
      expect(response.serviceId).toBeDefined();
      expect(response.statusCode).toBe(200);
      expect(response.responseTime).toBeGreaterThan(0);
      expect(response.timestamp).toBeDefined();
      expect(response.headers).toBeDefined();
    });
    
    test('should route based on matching rule', async () => {
      // Add a rule for specific path
      loadBalancer.addRule({
        name: 'users-rule',
        pathPattern: '/api/users/*',
        methodPattern: 'GET',
        priority: 10,
        targetServices: ['routing-service-1'], // Only route to service 1
        algorithm: LoadBalancingAlgorithm.ROUND_ROBIN,
        enabled: true
      });
      
      const request = {
        id: 'req-2',
        path: '/api/users/123',
        method: 'GET',
        headers: {},
        timestamp: new Date()
      };
      
      const response = await loadBalancer.routeRequest(request);
      
      expect(response.serviceId).toBe('routing-service-1');
      expect(response.statusCode).toBe(200);
    });
    
    test('should handle sticky sessions', async () => {
      // Add a rule with sticky sessions
      loadBalancer.addRule({
        name: 'sticky-rule',
        pathPattern: '/api/sticky/*',
        priority: 5,
        targetServices: ['routing-service-1', 'routing-service-2', 'routing-service-3'],
        algorithm: LoadBalancingAlgorithm.ROUND_ROBIN,
        stickySession: true,
        enabled: true
      });
      
      const sessionId = 'test-session-123';
      
      // First request with session
      const request1 = {
        id: 'req-sticky-1',
        path: '/api/sticky/resource',
        method: 'GET',
        headers: {},
        timestamp: new Date(),
        sessionId
      };
      
      const response1 = await loadBalancer.routeRequest(request1);
      const firstServiceId = response1.serviceId;
      
      // Second request with same session - should go to same service
      const request2 = {
        id: 'req-sticky-2',
        path: '/api/sticky/another',
        method: 'GET',
        headers: {},
        timestamp: new Date(),
        sessionId
      };
      
      const response2 = await loadBalancer.routeRequest(request2);
      
      expect(response2.serviceId).toBe(firstServiceId);
    });
  });
  
  describe('Load Balancing Algorithms', () => {
    beforeEach(() => {
      // Register services for algorithm tests
      for (let i = 1; i <= 5; i++) {
        loadBalancer.registerService({
          id: `algo-service-${i}`,
          name: 'algo-service',
          url: `http://service${i}:8080`,
          weight: i * 5, // Different weights
          maxConnections: 100,
          healthCheckPath: '/health',
          healthCheckInterval: 5000,
          drainMode: false,
          region: i % 2 === 0 ? 'us-east' : 'eu-west',
          zone: `zone-${i % 3}`
        });
      }
    });
    
    test('should route using round-robin algorithm', async () => {
      // Add rule with round-robin
      loadBalancer.addRule({
        name: 'round-robin-rule',
        pathPattern: '/api/round-robin/*',
        priority: 10,
        targetServices: ['algo-service-1', 'algo-service-2', 'algo-service-3'],
        algorithm: LoadBalancingAlgorithm.ROUND_ROBIN,
        enabled: true
      });
      
      const serviceIds = new Set<string>();
      
      // Make multiple requests
      for (let i = 0; i < 3; i++) {
        const request = {
          id: `req-rr-${i}`,
          path: '/api/round-robin/resource',
          method: 'GET',
          headers: {},
          timestamp: new Date()
        };
        
        const response = await loadBalancer.routeRequest(request);
        serviceIds.add(response.serviceId);
      }
      
      // Round-robin should use different services
      expect(serviceIds.size).toBeGreaterThan(1);
    });
    
    test('should route using least-connections algorithm', async () => {
      // Add rule with least-connections
      loadBalancer.addRule({
        name: 'least-conn-rule',
        pathPattern: '/api/least-conn/*',
        priority: 10,
        targetServices: ['algo-service-1', 'algo-service-2', 'algo-service-3'],
        algorithm: LoadBalancingAlgorithm.LEAST_CONNECTIONS,
        enabled: true
      });
      
      // First request
      const request1 = {
        id: 'req-lc-1',
        path: '/api/least-conn/resource',
        method: 'GET',
        headers: {},
        timestamp: new Date()
      };
      
      const response1 = await loadBalancer.routeRequest(request1);
      const firstServiceId = response1.serviceId;
      
      // Manually add connections to the first service to force selection of different service
      const services = ['algo-service-1', 'algo-service-2', 'algo-service-3'];
      for (const serviceId of services) {
        if (serviceId === firstServiceId) {
          // Simulate 10 active connections
          for (let i = 0; i < 10; i++) {
            await loadBalancer.routeRequest({
              id: `req-lc-setup-${i}`,
              path: '/api/least-conn/setup',
              method: 'GET',
              headers: {},
              timestamp: new Date()
            });
          }
          break;
        }
      }
      
      // Next request should not go to the busy service
      const request2 = {
        id: 'req-lc-2',
        path: '/api/least-conn/resource',
        method: 'GET',
        headers: {},
        timestamp: new Date()
      };
      
      const response2 = await loadBalancer.routeRequest(request2);
      
      // Should select a different service than the busy one
      expect(response2.serviceId).not.toBe(firstServiceId);
    });
    
    test('should route using weighted algorithm', async () => {
      // Add rule with weighted
      loadBalancer.addRule({
        name: 'weighted-rule',
        pathPattern: '/api/weighted/*',
        priority: 10,
        targetServices: ['algo-service-1', 'algo-service-5'], // Service 5 has 5x the weight of service 1
        algorithm: LoadBalancingAlgorithm.WEIGHTED,
        enabled: true
      });
      
      const serviceCounts: Record<string, number> = {
        'algo-service-1': 0,
        'algo-service-5': 0
      };
      
      // Make multiple requests
      for (let i = 0; i < 50; i++) {
        const request = {
          id: `req-weighted-${i}`,
          path: '/api/weighted/resource',
          method: 'GET',
          headers: {},
          timestamp: new Date()
        };
        
        const response = await loadBalancer.routeRequest(request);
        if (serviceCounts[response.serviceId] !== undefined) {
          serviceCounts[response.serviceId]++;
        }
      }
      
      // Service 5 should receive more requests than service 1 due to higher weight
      expect(serviceCounts['algo-service-5']).toBeGreaterThan(serviceCounts['algo-service-1']);
    });
  });
  
  describe('Health Checks and Failover', () => {
    beforeEach(() => {
      // Register services for health check tests
      for (let i = 1; i <= 3; i++) {
        loadBalancer.registerService({
          id: `health-service-${i}`,
          name: 'health-service',
          url: `http://service${i}:8080`,
          weight: 10,
          maxConnections: 100,
          healthCheckPath: '/health',
          healthCheckInterval: 100, // Fast for tests
          drainMode: false
        });
      }
      
      // Add a rule for health check tests
      loadBalancer.addRule({
        name: 'health-rule',
        pathPattern: '/api/health-test/*',
        priority: 10,
        targetServices: ['health-service-1', 'health-service-2', 'health-service-3'],
        algorithm: LoadBalancingAlgorithm.ROUND_ROBIN,
        enabled: true
      });
    });
    
    test('should route only to healthy services', async () => {
      // Wait for initial health checks
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Make a request
      const request = {
        id: 'req-health-1',
        path: '/api/health-test/resource',
        method: 'GET',
        headers: {},
        timestamp: new Date()
      };
      
      const response = await loadBalancer.routeRequest(request);
      
      // Should get a successful response
      expect(response.statusCode).toBe(200);
      expect(response.serviceId).toBeDefined();
      
      // Get stats to verify healthy services
      const stats = loadBalancer.getStats();
      expect(stats.services.healthy).toBeGreaterThan(0);
    });
    
    test('should failover to degraded services when no healthy ones available', async () => {
      // Enable failover
      loadBalancer = new LoadBalancerService({
        healthCheckInterval: 100,
        healthCheckTimeout: 100,
        failoverEnabled: true
      });
      
      // Register services
      const service1 = loadBalancer.registerService({
        id: 'failover-service-1',
        name: 'failover-service',
        url: 'http://service1:8080',
        weight: 10,
        maxConnections: 100,
        healthCheckPath: '/health',
        healthCheckInterval: 100,
        drainMode: false
      });
      
      // Manually set service to unhealthy
      service1.healthStatus = ServiceHealth.UNHEALTHY;
      
      const service2 = loadBalancer.registerService({
        id: 'failover-service-2',
        name: 'failover-service',
        url: 'http://service2:8080',
        weight: 10,
        maxConnections: 100,
        healthCheckPath: '/health',
        healthCheckInterval: 100,
        drainMode: false
      });
      
      // Set to degraded
      service2.healthStatus = ServiceHealth.DEGRADED;
      
      // Add a rule
      loadBalancer.addRule({
        name: 'failover-rule',
        pathPattern: '/api/failover/*',
        priority: 10,
        targetServices: ['failover-service-1', 'failover-service-2'],
        algorithm: LoadBalancingAlgorithm.ROUND_ROBIN,
        enabled: true
      });
      
      // Make a request
      const request = {
        id: 'req-failover-1',
        path: '/api/failover/resource',
        method: 'GET',
        headers: {},
        timestamp: new Date()
      };
      
      const response = await loadBalancer.routeRequest(request);
      
      // Should failover to the degraded service
      expect(response.serviceId).toBe('failover-service-2');
      expect(response.statusCode).toBe(200);
    });
  });
  
  describe('Service Statistics', () => {
    test('should track request statistics', async () => {
      // Register services
      loadBalancer.registerService({
        id: 'stats-service-1',
        name: 'stats-service',
        url: 'http://service1:8080',
        weight: 10,
        maxConnections: 100,
        healthCheckPath: '/health',
        healthCheckInterval: 5000,
        drainMode: false
      });
      
      // Make some requests
      for (let i = 0; i < 5; i++) {
        await loadBalancer.routeRequest({
          id: `req-stats-${i}`,
          path: '/api/stats/resource',
          method: 'GET',
          headers: {},
          timestamp: new Date()
        });
      }
      
      // Get stats
      const stats = loadBalancer.getStats();
      
      expect(stats.requests.total).toBe(5);
      expect(stats.requests.success).toBe(5);
      expect(stats.requests.failure).toBe(0);
      expect(stats.services.total).toBe(1);
      expect(stats.responseTime.average).toBeGreaterThan(0);
      
      // Get request distribution
      const distribution = loadBalancer.getRequestDistribution();
      expect(distribution['stats-service']).toBe(5);
    });
  });
});