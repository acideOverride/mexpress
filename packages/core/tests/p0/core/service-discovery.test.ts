/**
 * Service Discovery Tests
 * MEXP-2025-007-BE Integration Architecture P0 Tests
 */
import { ServiceDiscovery, ServiceInstance } from '../../../src/services/service-discovery';

describe('ServiceDiscovery', () => {
  let serviceDiscovery: ServiceDiscovery;
  
  beforeEach(() => {
    serviceDiscovery = new ServiceDiscovery({
      refreshInterval: 10000, // Slower to avoid refreshes during tests
      cacheExpiry: 200,
      enableCache: false // Disable cache by default
    });
  });
  
  afterEach(async () => {
    // Clean up resources
    await serviceDiscovery.shutdown();
    
    // Add a small delay to ensure cleanup completes
    await new Promise(resolve => setTimeout(resolve, 10));
  });
  
  describe('Registration and Discovery', () => {
    test('should register a service successfully', async () => {
      const instance: Omit<ServiceInstance, 'lastHeartbeat'> = {
        id: 'test-id-1',
        name: 'test-service',
        address: '127.0.0.1',
        port: 8080,
        version: '1.0.0',
        status: 'healthy',
        metadata: { region: 'us-east', zone: 'us-east-1a' }
      };
      
      const id = await serviceDiscovery.registerService(instance);
      expect(id).toBe(instance.id);
      
      const services = await serviceDiscovery.discoverService('test-service');
      expect(services).toHaveLength(1);
      expect(services[0].id).toBe(instance.id);
      expect(services[0].address).toBe(instance.address);
      expect(services[0].port).toBe(instance.port);
    });
    
    test('should deregister a service successfully', async () => {
      const instance: Omit<ServiceInstance, 'lastHeartbeat'> = {
        id: 'test-id-2',
        name: 'test-service-2',
        address: '127.0.0.1',
        port: 8081,
        version: '1.0.0',
        status: 'healthy',
        metadata: { region: 'us-east', zone: 'us-east-1a' }
      };
      
      await serviceDiscovery.registerService(instance);
      const services = await serviceDiscovery.discoverService('test-service-2');
      expect(services).toHaveLength(1);
      
      const result = await serviceDiscovery.deregisterService('test-service-2', 'test-id-2');
      expect(result).toBe(true);
      
      const servicesAfter = await serviceDiscovery.discoverService('test-service-2');
      expect(servicesAfter).toHaveLength(0);
    });
    
    test('should discover all services', async () => {
      await serviceDiscovery.registerService({
        id: 'service1-instance1',
        name: 'service1',
        address: '127.0.0.1',
        port: 8001,
        version: '1.0.0',
        status: 'healthy',
        metadata: {}
      });
      
      await serviceDiscovery.registerService({
        id: 'service2-instance1',
        name: 'service2',
        address: '127.0.0.1',
        port: 8002,
        version: '1.0.0',
        status: 'healthy',
        metadata: {}
      });
      
      const allServices = await serviceDiscovery.discoverAllServices();
      expect(Object.keys(allServices)).toHaveLength(2);
      expect(allServices['service1']).toBeDefined();
      expect(allServices['service2']).toBeDefined();
      expect(allServices['service1'][0].port).toBe(8001);
      expect(allServices['service2'][0].port).toBe(8002);
    });
  });
  
  describe('Health and Status', () => {
    test('should update service heartbeat', async () => {
      const instance: Omit<ServiceInstance, 'lastHeartbeat'> = {
        id: 'test-id-3',
        name: 'test-service-3',
        address: '127.0.0.1',
        port: 8082,
        version: '1.0.0',
        status: 'healthy',
        metadata: {}
      };
      
      await serviceDiscovery.registerService(instance);
      
      // Wait a bit to ensure the lastHeartbeat time changes
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const beforeUpdate = (await serviceDiscovery.discoverService('test-service-3'))[0].lastHeartbeat.getTime();
      
      // Update heartbeat
      const result = await serviceDiscovery.heartbeat('test-service-3', 'test-id-3');
      expect(result).toBe(true);
      
      const afterUpdate = (await serviceDiscovery.discoverService('test-service-3'))[0].lastHeartbeat.getTime();
      expect(afterUpdate).toBeGreaterThan(beforeUpdate);
    });
    
    test('should update service status', async () => {
      const instance: Omit<ServiceInstance, 'lastHeartbeat'> = {
        id: 'test-id-4',
        name: 'test-service-4',
        address: '127.0.0.1',
        port: 8083,
        version: '1.0.0',
        status: 'healthy',
        metadata: {}
      };
      
      await serviceDiscovery.registerService(instance);
      
      const beforeUpdate = (await serviceDiscovery.discoverService('test-service-4', true))[0].status;
      expect(beforeUpdate).toBe('healthy');
      
      // Update status to unhealthy
      const result = await serviceDiscovery.updateStatus('test-service-4', 'test-id-4', 'unhealthy');
      expect(result).toBe(true);
      
      const afterUpdate = (await serviceDiscovery.discoverService('test-service-4', true))[0].status;
      expect(afterUpdate).toBe('unhealthy');
    });
    
    test('should mark services as unhealthy after heartbeat timeout', async () => {
      serviceDiscovery = new ServiceDiscovery({
        refreshInterval: 50,   // Faster refresh for tests
        heartbeatTimeout: 100  // Short timeout for tests
      });
      
      const instance: Omit<ServiceInstance, 'lastHeartbeat'> = {
        id: 'test-id-5',
        name: 'test-service-5',
        address: '127.0.0.1',
        port: 8084,
        version: '1.0.0',
        status: 'healthy',
        metadata: {}
      };
      
      await serviceDiscovery.registerService(instance);
      
      // Verify it's healthy initially
      const services = await serviceDiscovery.discoverService('test-service-5');
      expect(services).toHaveLength(1);
      expect(services[0].status).toBe('healthy');
      
      // Wait for heartbeat timeout
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Service should be marked as unhealthy and not returned by default
      const servicesAfter = await serviceDiscovery.discoverService('test-service-5');
      expect(servicesAfter).toHaveLength(0);
    });
  });
  
  describe('Caching', () => {
    test('should cache service instances', async () => {
      // Create a new service discovery instance with caching enabled
      const cachingDiscovery = new ServiceDiscovery({
        enableCache: true,
        cacheExpiry: 1000, // Long expiry for test
        refreshInterval: 0 // Disable auto-refresh
      });
      
      // Register a test service
      await cachingDiscovery.registerService({
        id: 'cache-test-id',
        name: 'cache-test-service',
        address: '127.0.0.1',
        port: 8085,
        version: '1.0.0',
        status: 'healthy',
        metadata: {}
      });
      
      // First call puts it in cache
      await cachingDiscovery.discoverService('cache-test-service');
      
      // Directly modify the service in the registry to port 9999
      const registry = cachingDiscovery['registry'].services;
      const instances = registry.get('cache-test-service');
      if (instances && instances.length > 0) {
        instances[0].port = 9999;
      }
      
      // Second call should use cache with original port (8085)
      const cachedResult = await cachingDiscovery.discoverService('cache-test-service');
      expect(cachedResult[0].port).toBe(8085);
      
      // Invalidate cache
      cachingDiscovery['invalidateCache']('cache-test-service');
      
      // Third call should get fresh data with new port (9999)
      const freshResult = await cachingDiscovery.discoverService('cache-test-service');
      expect(freshResult[0].port).toBe(9999);
      
      // Clean up
      await cachingDiscovery.shutdown();
    });
    
    test('should invalidate cache when service is updated', async () => {
      serviceDiscovery = new ServiceDiscovery({
        enableCache: true,
        cacheExpiry: 500 // Long expiry for test
      });
      
      const instance: Omit<ServiceInstance, 'lastHeartbeat'> = {
        id: 'test-id-7',
        name: 'test-service-7',
        address: '127.0.0.1',
        port: 8086,
        version: '1.0.0',
        status: 'healthy',
        metadata: {}
      };
      
      await serviceDiscovery.registerService(instance);
      
      // First call to discover should cache results
      const services1 = await serviceDiscovery.discoverService('test-service-7');
      expect(services1).toHaveLength(1);
      expect(services1[0].status).toBe('healthy');
      
      // Update service status
      await serviceDiscovery.updateStatus('test-service-7', 'test-id-7', 'unhealthy');
      
      // Second call should return updated results (cache was invalidated)
      const services2 = await serviceDiscovery.discoverService('test-service-7');
      expect(services2).toHaveLength(0); // Unhealthy services are filtered out
    });
  });
  
  describe('Metadata and Statistics', () => {
    test('should return valid statistics', async () => {
      await serviceDiscovery.registerService({
        id: 'stats-service1',
        name: 'stats-service',
        address: '127.0.0.1',
        port: 9001,
        version: '1.0.0',
        status: 'healthy',
        metadata: {}
      });
      
      await serviceDiscovery.registerService({
        id: 'stats-service2',
        name: 'stats-service',
        address: '127.0.0.1',
        port: 9002,
        version: '1.0.0',
        status: 'unhealthy',
        metadata: {}
      });
      
      const stats = serviceDiscovery.getStats();
      expect(stats.services).toBe(1); // One service name
      expect(stats.instances).toBe(2); // Two instances
      expect(stats.healthy).toBe(1);   // One healthy instance
      
      // Discover service to populate cache
      await serviceDiscovery.discoverService('stats-service');
      
      const statsAfterCache = serviceDiscovery.getStats();
      expect(statsAfterCache.cacheSize).toBeGreaterThan(0);
    });
  });
});