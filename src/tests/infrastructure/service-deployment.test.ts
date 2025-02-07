import { ServiceDeployment } from '../../lib/service-deployment';
import { ServicePort, DeploymentConfigOptions } from '../../types/deployment-config';

describe('ServiceDeployment', () => {
  describe('Deployment Configuration', () => {
    let deployment: ServiceDeployment;
    const testPorts: ServicePort[] = [
      { port: 8080, targetPort: 8080, protocol: 'TCP', name: 'http' }
    ];
    
    beforeEach(() => {
      deployment = new ServiceDeployment({
        name: 'test-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: testPorts
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
      expect(config.spec.ports).toEqual(testPorts);
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

    test('should validate port configuration', () => {
      expect(() => new ServiceDeployment({
        name: 'test-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: -1, targetPort: -1, protocol: 'TCP' }]
      })).toThrow('Invalid port configuration');
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
          initialDelaySeconds: 30,
          periodSeconds: 10
        }
      });
    });

    test('should configure health check with defaults', () => {
      const config = deployment.getDeploymentConfig();
      expect(config.spec.healthCheck.path).toBe('/health');
      expect(config.spec.healthCheck.port).toBe(8080);
      expect(config.spec.healthCheck.initialDelaySeconds).toBe(30);
      expect(config.spec.healthCheck.periodSeconds).toBe(10);
      expect(config.spec.healthCheck.timeoutSeconds).toBe(5);
      expect(config.spec.healthCheck.successThreshold).toBe(1);
      expect(config.spec.healthCheck.failureThreshold).toBe(3);
    });

    test('should use default health check if not provided', () => {
      const basicDeployment = new ServiceDeployment({
        name: 'basic-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }]
      });
      const config = basicDeployment.getDeploymentConfig();
      expect(config.spec.healthCheck).toBeDefined();
      expect(config.spec.healthCheck.path).toBe('/');
      expect(config.spec.healthCheck.port).toBe(8080);
    });
  });

  describe('Resource Management', () => {
    let deployment: ServiceDeployment;
    
    beforeEach(() => {
      deployment = new ServiceDeployment({
        name: 'test-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        resources: {
          cpu: {
            request: '100m',
            limit: '200m'
          },
          memory: {
            request: '128Mi',
            limit: '256Mi'
          }
        }
      });
    });

    test('should configure resource limits', () => {
      const config = deployment.getDeploymentConfig();
      expect(config.spec.resources.cpu.request).toBe('100m');
      expect(config.spec.resources.cpu.limit).toBe('200m');
      expect(config.spec.resources.memory.request).toBe('128Mi');
      expect(config.spec.resources.memory.limit).toBe('256Mi');
    });

    test('should use default resource limits if not provided', () => {
      const basicDeployment = new ServiceDeployment({
        name: 'basic-service',
        namespace: 'default',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }]
      });
      const config = basicDeployment.getDeploymentConfig();
      expect(config.spec.resources.cpu.request).toBe('50m');
      expect(config.spec.resources.cpu.limit).toBe('100m');
      expect(config.spec.resources.memory.request).toBe('64Mi');
      expect(config.spec.resources.memory.limit).toBe('128Mi');
    });
  });
});