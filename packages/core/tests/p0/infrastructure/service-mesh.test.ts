import { ServiceMesh } from 'src/lib/service-mesh';
import { ServiceMeshProxy, ServiceMeshRoute, ServiceMeshPolicy } from 'src/types/service-mesh-config';

describe('ServiceMesh', () => {
  describe('Configuration Setup', () => {
    let serviceMesh: ServiceMesh;
    
    beforeEach(() => {
      serviceMesh = new ServiceMesh({
        name: 'test-mesh',
        namespace: 'default',
        ingress: {
          enabled: true,
          port: 8080
        }
      });
    });

    test('should create valid service mesh configuration', () => {
      const config = serviceMesh.getMeshConfig();
      expect(config.apiVersion).toBe('v1');
      expect(config.kind).toBe('ServiceMeshConfiguration');
      expect(config.metadata.name).toBe('test-mesh');
      expect(config.spec.ingress.enabled).toBe(true);
      expect(config.spec.ingress.port).toBe(8080);
    });

    test('should throw error for invalid configuration', () => {
      expect(() => new ServiceMesh({
        name: '',
        namespace: ''
      })).toThrow('Invalid service mesh configuration');
    });
  });

  describe('Proxy Management', () => {
    let serviceMesh: ServiceMesh;
    
    beforeEach(() => {
      serviceMesh = new ServiceMesh({
        name: 'test-mesh',
        namespace: 'default',
        proxies: [{
          name: 'api-proxy',
          port: 9000,
          protocol: 'http',
          timeout: 5000,
          retries: 3,
          circuitBreaker: {
            enabled: true,
            threshold: 0.5,
            interval: 30,
            timeout: 60
          }
        }]
      });
    });

    test('should configure proxy with circuit breaker', () => {
      const config = serviceMesh.getMeshConfig();
      const proxy = config.spec.proxies[0];
      expect(proxy.name).toBe('api-proxy');
      expect(proxy.port).toBe(9000);
      expect(proxy.circuitBreaker.enabled).toBe(true);
      expect(proxy.circuitBreaker.threshold).toBe(0.5);
    });

    test('should validate proxy configuration', () => {
      expect(() => serviceMesh.addProxy({
        name: '',
        port: -1,
        protocol: 'invalid' as any,
        timeout: 0,
        retries: -1,
        circuitBreaker: {
          enabled: true,
          threshold: 2,
          interval: -1,
          timeout: 0
        }
      })).toThrow('Invalid proxy configuration');
    });
  });

  describe('Route Management', () => {
    let serviceMesh: ServiceMesh;
    
    beforeEach(() => {
      serviceMesh = new ServiceMesh({
        name: 'test-mesh',
        namespace: 'default',
        routes: [{
          name: 'api-route',
          path: '/api/v1',
          method: 'GET',
          service: 'api-service',
          timeout: 5000,
          retries: 3,
          loadBalancer: {
            type: 'round-robin',
            weight: 1
          }
        }]
      });
    });

    test('should configure route with load balancer', () => {
      const config = serviceMesh.getMeshConfig();
      const route = config.spec.routes[0];
      expect(route.name).toBe('api-route');
      expect(route.path).toBe('/api/v1');
      expect(route.loadBalancer.type).toBe('round-robin');
    });

    test('should validate route configuration', () => {
      expect(() => serviceMesh.addRoute({
        name: '',
        path: '',
        method: 'INVALID' as any,
        service: '',
        timeout: -1,
        retries: -1,
        loadBalancer: {
          type: 'invalid' as any
        }
      })).toThrow('Invalid route configuration');
    });
  });

  describe('Policy Management', () => {
    let serviceMesh: ServiceMesh;
    
    beforeEach(() => {
      serviceMesh = new ServiceMesh({
        name: 'test-mesh',
        namespace: 'default',
        policies: [{
          name: 'rate-limit-policy',
          type: 'rate-limit',
          scope: 'global',
          config: {
            rateLimit: {
              requests: 1000,
              interval: 60,
              burst: 100
            }
          }
        }]
      });
    });

    test('should configure rate limit policy', () => {
      const config = serviceMesh.getMeshConfig();
      const policy = config.spec.policies[0];
      expect(policy.name).toBe('rate-limit-policy');
      expect(policy.type).toBe('rate-limit');
      expect(policy.config.rateLimit?.requests).toBe(1000);
    });

    test('should validate policy configuration', () => {
      expect(() => serviceMesh.addPolicy({
        name: '',
        type: 'invalid' as any,
        scope: 'invalid' as any,
        config: {}
      })).toThrow('Invalid policy configuration');
    });
  });

  describe('Metrics and Monitoring', () => {
    let serviceMesh: ServiceMesh;
    
    beforeEach(() => {
      serviceMesh = new ServiceMesh({
        name: 'test-mesh',
        namespace: 'default',
        metrics: {
          enabled: true,
          interval: 15,
          retention: 86400,
          exporters: {
            prometheus: {
              enabled: true,
              port: 9090
            },
            jaeger: {
              enabled: true,
              endpoint: 'http://jaeger:14268/api/traces',
              samplingRate: 0.1
            }
          }
        }
      });
    });

    test('should configure metrics collection', () => {
      const config = serviceMesh.getMeshConfig();
      expect(config.spec.metrics.enabled).toBe(true);
      expect(config.spec.metrics.exporters.prometheus?.enabled).toBe(true);
      expect(config.spec.metrics.exporters.jaeger?.enabled).toBe(true);
    });

    test('should validate metrics configuration', () => {
      expect(() => serviceMesh.updateMetrics({
        enabled: true,
        interval: -1,
        retention: -1,
        exporters: {
          prometheus: {
            enabled: true,
            port: -1
          }
        }
      })).toThrow('Invalid metrics configuration');
    });
  });

  describe('Service Discovery', () => {
    let serviceMesh: ServiceMesh;
    
    beforeEach(() => {
      serviceMesh = new ServiceMesh({
        name: 'test-mesh',
        namespace: 'default',
        discovery: {
          enabled: true,
          type: 'kubernetes',
          interval: 30,
          ttl: 300
        }
      });
    });

    test('should configure service discovery', () => {
      const config = serviceMesh.getMeshConfig();
      expect(config.spec.discovery.enabled).toBe(true);
      expect(config.spec.discovery.type).toBe('kubernetes');
      expect(config.spec.discovery.interval).toBe(30);
    });

    test('should validate discovery configuration', () => {
      expect(() => serviceMesh.updateDiscovery({
        enabled: true,
        type: 'invalid' as any,
        interval: -1,
        ttl: -1
      })).toThrow('Invalid discovery configuration');
    });
  });
});