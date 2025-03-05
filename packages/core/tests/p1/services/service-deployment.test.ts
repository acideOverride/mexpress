// MEXP-2025-007-BE Integration Architecture
import { ServiceDeployment } from '@mexpress/utils/src/lib/service-deployment';
import { DeploymentConfigOptions, ServicePort, HealthCheck } from '@mexpress/utils/src/types/deployment-config';

describe('ServiceDeployment', () => {
  describe('Configuration Setup', () => {
    let deployment: ServiceDeployment;
    
    beforeEach(() => {
      deployment = new ServiceDeployment({
        name: 'test-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }]
      });
    });

    test('should create valid deployment configuration', () => {
      const config = deployment.getDeploymentConfig();
      expect(config.apiVersion).toBe('v1');
      expect(config.kind).toBe('Deployment');
      expect(config.metadata.name).toBe('test-service');
      expect(config.metadata.namespace).toBe('default');
      expect(config.spec.image).toBe('nginx');
      expect(config.spec.version).toBe('1.21');
      expect(config.spec.ports[0].port).toBe(8080);
    });

    test('should throw error for invalid configuration', () => {
      expect(() => new ServiceDeployment({
        name: '',
        namespace: '',
        image: '',
        version: '',
        ports: []
      })).toThrow('Invalid deployment configuration');
    });
  });

  describe('Health Check Configuration', () => {
    let deployment: ServiceDeployment;
    
    beforeEach(() => {
      deployment = new ServiceDeployment({
        name: 'test-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        healthCheck: {
          path: '/health',
          port: 8080,
          initialDelaySeconds: 10,
          periodSeconds: 30,
          timeoutSeconds: 5,
          successThreshold: 1,
          failureThreshold: 3
        }
      });
    });

    test('should configure health check', () => {
      const config = deployment.getDeploymentConfig();
      expect(config.spec.healthCheck?.path).toBe('/health');
      expect(config.spec.healthCheck?.port).toBe(8080);
      expect(config.spec.healthCheck?.initialDelaySeconds).toBe(10);
      expect(config.spec.healthCheck?.periodSeconds).toBe(30);
      expect(config.spec.healthCheck?.timeoutSeconds).toBe(5);
      expect(config.spec.healthCheck?.successThreshold).toBe(1);
      expect(config.spec.healthCheck?.failureThreshold).toBe(3);
    });

    test('should validate health check configuration', () => {
      expect(() => new ServiceDeployment({
        name: 'test-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        healthCheck: {
          path: '',
          port: -1,
          initialDelaySeconds: -1,
          periodSeconds: -1,
          timeoutSeconds: -1,
          successThreshold: -1,
          failureThreshold: -1
        }
      })).toThrow('Invalid deployment configuration');
    });
  });

  describe('Resource Configuration', () => {
    let deployment: ServiceDeployment;
    
    beforeEach(() => {
      deployment = new ServiceDeployment({
        name: 'test-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        resources: {
          requests: {
            cpu: '100m',
            memory: '128Mi'
          },
          limits: {
            cpu: '200m',
            memory: '256Mi'
          }
        }
      });
    });

    test('should configure resource limits', () => {
      const config = deployment.getDeploymentConfig();
      expect(config.spec.resources?.requests?.cpu).toBe('100m');
      expect(config.spec.resources?.requests?.memory).toBe('128Mi');
      expect(config.spec.resources?.limits?.cpu).toBe('200m');
      expect(config.spec.resources?.limits?.memory).toBe('256Mi');
    });

    test('should validate resource configuration', () => {
      expect(() => new ServiceDeployment({
        name: 'test-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        resources: {
          requests: {
            cpu: '-100m',
            memory: '-128Mi'
          },
          limits: {
            cpu: '-200m',
            memory: '-256Mi'
          }
        }
      })).toThrow('Invalid deployment configuration');
    });
  });
});