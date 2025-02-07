import { ContainerOrchestrator } from '../../lib/container-orchestrator';
import { KubernetesConfig } from '../../lib/kubernetes-config';
import { ContainerRuntime } from '../../lib/container-runtime';
import { ServiceDeployment } from '../../lib/service-deployment';
import { HighAvailability } from '../../lib/high-availability';

describe('ContainerOrchestrator', () => {
  describe('Orchestration Setup', () => {
    let orchestrator: ContainerOrchestrator;
    
    beforeEach(() => {
      orchestrator = new ContainerOrchestrator({
        clusterName: 'test-cluster',
        namespace: 'test-ns',
        region: 'us-east-1'
      });
    });

    test('should initialize all components', () => {
      const config = orchestrator.getConfiguration();
      expect(config.kubernetes).toBeInstanceOf(KubernetesConfig);
      expect(config.runtime).toBeInstanceOf(ContainerRuntime);
      expect(config.deployment).toBeInstanceOf(ServiceDeployment);
      expect(config.highAvailability).toBeInstanceOf(HighAvailability);
    });

    test('should throw error for invalid configuration', () => {
      expect(() => new ContainerOrchestrator({
        clusterName: '',
        namespace: '',
        region: ''
      })).toThrow('Invalid orchestration configuration');
    });
  });

  describe('Service Deployment', () => {
    let orchestrator: ContainerOrchestrator;
    
    beforeEach(() => {
      orchestrator = new ContainerOrchestrator({
        clusterName: 'test-cluster',
        namespace: 'test-ns',
        region: 'us-east-1'
      });
    });

    test('should deploy service with HA configuration', () => {
      const deployment = orchestrator.deployService({
        name: 'test-service',
        image: 'nginx',
        version: '1.21',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        replicas: {
          min: 2,
          max: 5,
          target: 3
        }
      });

      expect(deployment.status).toBe('Deployed');
      expect(deployment.service.name).toBe('test-service');
      expect(deployment.ha.enabled).toBe(true);
      expect(deployment.runtime.engine).toBe('containerd');
    });

    test('should validate service configuration', () => {
      expect(() => orchestrator.deployService({
        name: '',
        image: '',
        version: '',
        ports: []
      })).toThrow('Invalid service configuration');
    });
  });

  describe('Resource Management', () => {
    let orchestrator: ContainerOrchestrator;
    
    beforeEach(() => {
      orchestrator = new ContainerOrchestrator({
        clusterName: 'test-cluster',
        namespace: 'test-ns',
        region: 'us-east-1'
      });
    });

    test('should manage cluster resources', () => {
      const resources = orchestrator.getResourceAllocation();
      expect(resources.cpu.allocated).toBeDefined();
      expect(resources.memory.allocated).toBeDefined();
      expect(resources.pods.allocated).toBeDefined();
      expect(resources.nodes.available).toBeGreaterThan(0);
    });

    test('should enforce resource limits', () => {
      expect(() => orchestrator.deployService({
        name: 'resource-heavy',
        image: 'heavy-app',
        version: '1.0',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
        resources: {
          cpu: {
            request: '100000m',
            limit: '200000m'
          }
        }
      })).toThrow('Resource limits exceeded');
    });
  });

  describe('Integration Tests', () => {
    let orchestrator: ContainerOrchestrator;
    
    beforeEach(() => {
      orchestrator = new ContainerOrchestrator({
        clusterName: 'test-cluster',
        namespace: 'test-ns',
        region: 'us-east-1'
      });
    });

    test('should handle complete deployment lifecycle', () => {
      const deployment = orchestrator.deployService({
        name: 'lifecycle-test',
        image: 'test-app',
        version: '1.0',
        ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }]
      });

      expect(deployment.status).toBe('Deployed');

      const scaled = orchestrator.scaleService('lifecycle-test', 5);
      expect(scaled.service.replicas.current).toBe(5);

      const updated = orchestrator.updateService('lifecycle-test', {
        version: '1.1'
      });
      expect(updated.service.version).toBe('1.1');

      const removed = orchestrator.removeService('lifecycle-test');
      expect(removed.status).toBe('Removed');
    });
  });
});