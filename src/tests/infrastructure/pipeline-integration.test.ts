import { Pipeline } from '../../lib/pipeline';
import { ContainerOrchestrator } from '../../lib/container-orchestrator';
import { ServiceMesh } from '../../lib/service-mesh';
import { ContainerRuntime } from '../../lib/container-runtime';
import { ServiceDeployment } from '../../lib/service-deployment';
import { OrchestratorConfig } from '../../types/orchestrator-config';
import { RuntimeConfigOptions } from '../../types/runtime-config';
import { DeploymentConfigOptions, ServicePort } from '../../types/deployment-config';
import { ServiceMeshConfigOptions } from '../../types/service-mesh-config';
import {
  IContainerOrchestrator,
  IServiceMesh,
  IContainerRuntime,
  IServiceDeployment
} from '../../types/integration-test-types';

// Extend PipelineConfigOptions for testing
declare module '../../types/pipeline-config' {
  interface PipelineConfigOptions {
    infrastructure?: {
      orchestrator: IContainerOrchestrator;
      serviceMesh: IServiceMesh;
      runtime: IContainerRuntime;
      deployment: IServiceDeployment;
    };
  }
}

describe('Pipeline Integration', () => {
  let pipeline: Pipeline;
  let orchestrator: jest.Mocked<IContainerOrchestrator>;
  let serviceMesh: jest.Mocked<IServiceMesh>;
  let runtime: jest.Mocked<IContainerRuntime>;
  let deployment: jest.Mocked<IServiceDeployment>;

  const testPort: ServicePort = {
    name: 'http',
    port: 8080,
    targetPort: 8080,
    protocol: 'TCP'
  };

  beforeEach(() => {
    // Create mock instances
    orchestrator = {
      initialize: jest.fn().mockResolvedValue(undefined),
      listResources: jest.fn().mockResolvedValue([]),
      validateDeployment: jest.fn().mockResolvedValue({ valid: true, errorRate: 0 })
    };

    serviceMesh = {
      initialize: jest.fn().mockResolvedValue(undefined),
      getServiceConfig: jest.fn().mockResolvedValue({
        service: 'test-pipeline',
        routing: { destinations: [] },
        security: { tls: true, mtls: true, policies: [] }
      }),
      getTrafficRouting: jest.fn().mockResolvedValue({
        destinations: [{ version: 'v1', weight: 100 }]
      })
    };

    runtime = {
      initialize: jest.fn().mockResolvedValue(undefined),
      setupCache: jest.fn().mockResolvedValue(undefined),
      listImages: jest.fn().mockResolvedValue([]),
      getCacheStats: jest.fn()
        .mockResolvedValueOnce({ hits: 0, misses: 1, size: 0 })    // First build - no cache
        .mockResolvedValue({ hits: 1, misses: 0, size: 100 })      // Second build - cache hit
    };

    deployment = {
      initialize: jest.fn().mockResolvedValue(undefined),
      getStatus: jest.fn().mockResolvedValue({
        phase: 'Running',
        availableReplicas: 3,
        conditions: [{ type: 'Available', status: 'True' }]
      }),
      validateHealth: jest.fn().mockResolvedValue({ healthy: true, errorRate: 0 }),
      getDeploymentConfig: jest.fn().mockReturnValue({
        strategy: 'rolling',
        environment: 'staging',
        replicas: 3,
        healthCheck: {
          path: '/health',
          port: 8080,
          initialDelay: 10,
          period: 30,
          timeout: 5,
          successThreshold: 1,
          failureThreshold: 3
        },
        rollback: {
          enabled: true,
          timeout: 300,
          criteria: {
            errorRate: 0.1,
            latency: 1000
          }
        },
        resources: {
          limits: {
            cpu: '1',
            memory: '1Gi'
          },
          requests: {
            cpu: '500m',
            memory: '512Mi'
          }
        }
      })
    };

    // Create pipeline instance with injected mocks
    pipeline = new Pipeline({
      name: 'test-pipeline',
      namespace: 'default',
      deployment: {
        strategy: 'rolling',
        environment: 'staging',
        replicas: 3,
        healthCheck: {
          path: '/health',
          port: 8080,
          initialDelay: 10,
          period: 30,
          timeout: 5,
          successThreshold: 1,
          failureThreshold: 3
        },
        rollback: {
          enabled: true,
          timeout: 300,
          criteria: {
            errorRate: 0.1,
            latency: 1000
          }
        }
      },
      infrastructure: {
        orchestrator,
        serviceMesh,
        runtime,
        deployment
      }
    });
  });

  describe('Container Orchestration Integration', () => {
    test('should integrate with container orchestrator for deployment', async () => {
      await orchestrator.initialize();
      
      const result = await pipeline.executeDeploy();
      expect(result.success).toBe(true);

      expect(orchestrator.listResources).toHaveBeenCalled();
      const resources = await orchestrator.listResources();
      expect(resources).toHaveLength(0);
    });

    test('should handle rollback through orchestrator', async () => {
      orchestrator.validateDeployment.mockResolvedValueOnce({ valid: false, errorRate: 0.2 });

      const result = await pipeline.executeDeploy();
      expect(result.success).toBe(true);
      expect(result.metrics.rollbacks).toBe(1);

      expect(orchestrator.listResources).toHaveBeenCalled();
    });
  });

  describe('Service Mesh Integration', () => {
    test('should configure service mesh during deployment', async () => {
      await serviceMesh.initialize();

      const result = await pipeline.executeDeploy();
      expect(result.success).toBe(true);

      expect(serviceMesh.getServiceConfig).toHaveBeenCalledWith('test-pipeline');
    });

    test('should update traffic routing during deployment', async () => {
      await serviceMesh.initialize();

      const result = await pipeline.executeDeploy();
      expect(result.success).toBe(true);

      expect(serviceMesh.getTrafficRouting).toHaveBeenCalledWith('test-pipeline');
    });
  });

  describe('Container Runtime Integration', () => {
    test('should build and cache images through runtime', async () => {
      await runtime.initialize();

      const result = await pipeline.executeBuild();
      expect(result.success).toBe(true);

      expect(runtime.listImages).toHaveBeenCalled();
    });

    test('should utilize runtime cache for builds', async () => {
      await runtime.initialize();
      await runtime.setupCache();

      const firstBuild = await pipeline.executeBuild();
      expect(firstBuild.success).toBe(true);

      const secondBuild = await pipeline.executeBuild();
      expect(secondBuild.success).toBe(true);
      expect(secondBuild.metrics.duration).toBeLessThan(firstBuild.metrics.duration);

      expect(runtime.getCacheStats).toHaveBeenCalled();
    });
  });

  describe('Service Deployment Integration', () => {
    test('should coordinate deployment across components', async () => {
      await Promise.all([
        orchestrator.initialize(),
        serviceMesh.initialize(),
        runtime.initialize(),
        deployment.initialize()
      ]);

      const result = await pipeline.executeDeploy();
      expect(result.success).toBe(true);

      expect(deployment.getStatus).toHaveBeenCalledWith('test-pipeline');
      expect(orchestrator.listResources).toHaveBeenCalled();
      expect(serviceMesh.getServiceConfig).toHaveBeenCalledWith('test-pipeline');
      expect(runtime.listImages).toHaveBeenCalled();
    });

    test('should handle rollback across components', async () => {
      await Promise.all([
        orchestrator.initialize(),
        serviceMesh.initialize(),
        runtime.initialize(),
        deployment.initialize()
      ]);

      deployment.validateHealth.mockResolvedValueOnce({ healthy: false, errorRate: 0.2 });

      const result = await pipeline.executeDeploy();
      expect(result.success).toBe(true);
      expect(result.metrics.rollbacks).toBe(1);

      expect(orchestrator.listResources).toHaveBeenCalled();
      expect(serviceMesh.getServiceConfig).toHaveBeenCalledWith('test-pipeline');
      expect(deployment.getStatus).toHaveBeenCalledWith('test-pipeline');
    });
  });
});