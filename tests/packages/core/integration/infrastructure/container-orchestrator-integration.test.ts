import { ContainerOrchestrator } from '../../lib/container-orchestrator';
import { ServiceMeshProxy, ServiceMeshRoute } from '@mexpress/utils/src/types/service-mesh-config';

describe('ContainerOrchestrator Integration', () => {
  let orchestrator: ContainerOrchestrator;

  beforeEach(() => {
    orchestrator = new ContainerOrchestrator({
      clusterName: 'test-cluster',
      namespace: 'test-ns',
      region: 'us-east-1'
    });
  });

  describe('Service Mesh Integration', () => {
    test('should deploy service with mesh configuration', async () => {
      // Configure service mesh proxy
      const proxy: ServiceMeshProxy = {
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
      };

      // Configure service mesh route
      const route: ServiceMeshRoute = {
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
      };

      // Deploy service with mesh configuration
      const deployment = await orchestrator.deployServiceWithMesh({
        name: 'api-service',
        image: 'api-image',
        version: '1.0',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        replicas: {
          min: 2,
          max: 5,
          target: 3
        },
        mesh: {
          proxy,
          route,
          policies: [{
            name: 'rate-limit',
            type: 'rate-limit',
            scope: 'service',
            target: 'api-service',
            config: {
              rateLimit: {
                requests: 1000,
                interval: 60,
                burst: 100
              }
            }
          }]
        }
      });

      expect(deployment.status).toBe('Deployed');
      expect(deployment.service.name).toBe('api-service');
      expect(deployment.mesh?.enabled).toBe(true);
      expect(deployment.mesh?.proxy.name).toBe('api-proxy');
      expect(deployment.mesh?.route.path).toBe('/api/v1');
    });

    test('should update service mesh configuration', async () => {
      // Deploy initial service
      await orchestrator.deployServiceWithMesh({
        name: 'api-service',
        image: 'api-image',
        version: '1.0',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        mesh: {
          proxy: {
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
          },
          route: {
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
          }
        }
      });

      // Update mesh configuration with explicit values
      const updated = await orchestrator.updateServiceMesh('api-service', {
        proxy: {
          timeout: 10000,
          retries: 5,
          circuitBreaker: {
            enabled: true,
            threshold: 0.7,
            interval: 30,
            timeout: 60
          }
        },
        route: {
          timeout: 10000,
          loadBalancer: {
            type: 'least-conn'
          }
        }
      });

      // Verify the explicit updates were applied
      expect(updated.mesh?.proxy.timeout).toBe(10000);
      expect(updated.mesh?.proxy.retries).toBe(5);
      expect(updated.mesh?.proxy.circuitBreaker.threshold).toBe(0.7);
      expect(updated.mesh?.route.timeout).toBe(10000);
      expect(updated.mesh?.route.loadBalancer.type).toBe('least-conn');
    });

    test('should handle service mesh failures gracefully', async () => {
      // Attempt to deploy with invalid mesh configuration
      await expect(orchestrator.deployServiceWithMesh({
        name: 'invalid-service',
        image: 'invalid-image',
        version: '1.0',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        mesh: {
          proxy: {
            name: '',
            port: -1,
            protocol: 'invalid' as any,
            timeout: -1,
            retries: -1,
            circuitBreaker: {
              enabled: true,
              threshold: 2,
              interval: -1,
              timeout: -1
            }
          },
          route: {
            name: '',
            path: '',
            method: 'INVALID' as any,
            service: '',
            timeout: -1,
            retries: -1,
            loadBalancer: {
              type: 'invalid' as any
            }
          }
        }
      })).rejects.toThrow('Invalid service mesh configuration');
    });

    test('should remove service with mesh configuration', async () => {
      // Deploy service first
      await orchestrator.deployServiceWithMesh({
        name: 'temp-service',
        image: 'temp-image',
        version: '1.0',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        mesh: {
          proxy: {
            name: 'temp-proxy',
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
          },
          route: {
            name: 'temp-route',
            path: '/api/v1',
            method: 'GET',
            service: 'temp-service',
            timeout: 5000,
            retries: 3,
            loadBalancer: {
              type: 'round-robin',
              weight: 1
            }
          }
        }
      });

      // Remove service and mesh configuration
      const removed = await orchestrator.removeService('temp-service');
      expect(removed.status).toBe('Removed');
      expect(removed.mesh?.enabled).toBe(false);
    });
  });

  describe('End-to-End Service Lifecycle', () => {
    test('should handle complete service lifecycle with mesh', async () => {
      // 1. Deploy service with mesh
      const deployment = await orchestrator.deployServiceWithMesh({
        name: 'lifecycle-service',
        image: 'lifecycle-image',
        version: '1.0',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        mesh: {
          proxy: {
            name: 'lifecycle-proxy',
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
          },
          route: {
            name: 'lifecycle-route',
            path: '/api/v1',
            method: 'GET',
            service: 'lifecycle-service',
            timeout: 5000,
            retries: 3,
            loadBalancer: {
              type: 'round-robin',
              weight: 1
            }
          }
        }
      });

      expect(deployment.status).toBe('Deployed');
      expect(deployment.mesh?.enabled).toBe(true);

      // 2. Scale service
      const scaled = await orchestrator.scaleService('lifecycle-service', 5);
      expect(scaled.service.replicas.current).toBe(5);
      expect(scaled.mesh?.enabled).toBe(true);

      // 3. Update service version
      const updated = await orchestrator.updateService('lifecycle-service', {
        version: '1.1'
      });
      expect(updated.service.version).toBe('1.1');
      expect(updated.mesh?.enabled).toBe(true);

      // 4. Remove service
      const removed = await orchestrator.removeService('lifecycle-service');
      expect(removed.status).toBe('Removed');
      expect(removed.mesh?.enabled).toBe(false);
    });
  });
});