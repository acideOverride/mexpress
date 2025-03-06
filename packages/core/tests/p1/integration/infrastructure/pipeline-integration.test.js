/**
 * Pipeline Integration Tests
 * 
 * @BRQ MEXP-2025-007-BE Service Integration Architecture
 */

// Import our mock implementations
const { Pipeline } = require('../../lib/pipeline');
const { ContainerOrchestrator } = require('../../lib/container-orchestrator');
const { ServiceMesh } = require('../../lib/service-mesh');
const { ContainerRuntime } = require('../../lib/container-runtime');
const { ServiceDeployment } = require('../../lib/service-deployment');

describe('Pipeline Integration', () => {
  let pipeline;
  let orchestrator;
  let serviceMesh;
  let runtime;
  let deployment;

  const testPort = {
    name: 'http',
    port: 8080,
    targetPort: 8080,
    protocol: 'TCP'
  };

  beforeEach(() => {
    // Create instances with mocked methods
    orchestrator = new ContainerOrchestrator();
    jest.spyOn(orchestrator, 'initialize');
    jest.spyOn(orchestrator, 'listResources');
    jest.spyOn(orchestrator, 'validateDeployment');

    serviceMesh = new ServiceMesh();
    jest.spyOn(serviceMesh, 'initialize');
    jest.spyOn(serviceMesh, 'getServiceConfig');
    jest.spyOn(serviceMesh, 'getTrafficRouting');

    runtime = new ContainerRuntime();
    jest.spyOn(runtime, 'initialize');
    jest.spyOn(runtime, 'setupCache');
    jest.spyOn(runtime, 'listImages');
    jest.spyOn(runtime, 'getCacheStats');

    deployment = new ServiceDeployment();
    jest.spyOn(deployment, 'initialize');
    jest.spyOn(deployment, 'getStatus');
    jest.spyOn(deployment, 'validateHealth');
    jest.spyOn(deployment, 'getDeploymentConfig');

    // Create pipeline instance with injected components
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
      // Override validation for this test
      orchestrator.validateDeployment = jest.fn().mockResolvedValueOnce({ valid: false, errorRate: 0.2 });

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

      // Override health validation for this test
      deployment.validateHealth = jest.fn().mockResolvedValueOnce({ healthy: false, errorRate: 0.2 });

      const result = await pipeline.executeDeploy();
      expect(result.success).toBe(true);
      expect(result.metrics.rollbacks).toBe(1);

      expect(orchestrator.listResources).toHaveBeenCalled();
      expect(serviceMesh.getServiceConfig).toHaveBeenCalledWith('test-pipeline');
      expect(deployment.getStatus).toHaveBeenCalledWith('test-pipeline');
    });
  });
});