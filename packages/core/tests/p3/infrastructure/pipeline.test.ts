import { Pipeline } from '../../lib/pipeline';
import { PipelineConfigOptions, StageExecutionResult } from '../../types/pipeline-config';

describe('Pipeline', () => {
  describe('Configuration Setup', () => {
    let pipeline: Pipeline;
    
    beforeEach(() => {
      pipeline = new Pipeline({
        name: 'test-pipeline',
        namespace: 'default',
        stages: [
          {
            name: 'lint',
            timeout: 300,
            retries: 2,
            parallel: false,
            dependencies: [],
            environment: { NODE_ENV: 'test' }
          },
          {
            name: 'test',
            timeout: 600,
            retries: 1,
            parallel: true,
            dependencies: ['lint'],
            environment: { NODE_ENV: 'test' }
          }
        ],
        build: {
          tool: 'docker',
          version: 'latest',
          args: ['--no-cache'],
          cache: {
            enabled: true,
            layers: true,
            dependencies: true
          },
          output: {
            path: './dist',
            artifacts: ['app.js', 'assets/*']
          }
        }
      });
    });

    test('should create valid pipeline configuration', () => {
      const config = pipeline.getPipelineConfig();
      expect(config.apiVersion).toBe('v1');
      expect(config.kind).toBe('PipelineConfiguration');
      expect(config.metadata.name).toBe('test-pipeline');
      expect(config.spec.stages).toHaveLength(2);
      expect(config.spec.build.tool).toBe('docker');
    });

    test('should throw error for invalid configuration', () => {
      expect(() => new Pipeline({
        name: '',
        namespace: '',
        stages: [
          {
            name: 'lint',
            timeout: -1,
            retries: -1,
            parallel: false,
            dependencies: ['test'],
            environment: {}
          }
        ]
      })).toThrow('Invalid pipeline configuration');
    });
  });

  describe('Stage Execution', () => {
    let pipeline: Pipeline;
    
    beforeEach(() => {
      pipeline = new Pipeline({
        name: 'test-pipeline',
        namespace: 'default',
        stages: [
          {
            name: 'lint',
            timeout: 300,
            retries: 2,
            parallel: false,
            dependencies: [],
            environment: { NODE_ENV: 'test' }
          }
        ]
      });
    });

    test('should execute stage successfully', async () => {
      const result = await pipeline.executeStage('lint');
      expect(result.success).toBe(true);
      expect(result.stage).toBe('lint');
      expect(result.duration).toBeLessThan(300);
    });

    test('should handle stage failure with retries', async () => {
      jest.spyOn(pipeline as any, 'runStage')
        .mockRejectedValueOnce(new Error('Stage failed'))
        .mockResolvedValueOnce({} as StageExecutionResult);

      const result = await pipeline.executeStage('lint');
      expect(result.success).toBe(true);
      expect(result.stage).toBe('lint');
    });
  });

  describe('Build Automation', () => {
    let pipeline: Pipeline;
    
    beforeEach(() => {
      pipeline = new Pipeline({
        name: 'test-pipeline',
        namespace: 'default',
        build: {
          tool: 'docker',
          version: 'latest',
          args: ['--no-cache'],
          cache: {
            enabled: true,
            layers: true,
            dependencies: true
          },
          output: {
            path: './dist',
            artifacts: ['app.js']
          }
        }
      });
    });

    test('should execute build process', async () => {
      const result = await pipeline.executeBuild();
      expect(result.success).toBe(true);
      expect(result.artifacts).toContain('app.js');
      expect(result.metrics.duration).toBeLessThan(300);
    });

    test('should utilize build cache', async () => {
      const firstBuild = await pipeline.executeBuild();
      const secondBuild = await pipeline.executeBuild();
      expect(secondBuild.metrics.duration).toBeLessThan(firstBuild.metrics.duration);
    });
  });

  describe('Test Integration', () => {
    let pipeline: Pipeline;
    
    beforeEach(() => {
      pipeline = new Pipeline({
        name: 'test-pipeline',
        namespace: 'default',
        test: {
          framework: 'jest',
          runner: 'npm',
          coverage: {
            tool: 'istanbul',
            threshold: {
              statements: 90,
              branches: 85,
              functions: 90,
              lines: 90
            },
            excludePaths: []
          },
          suites: {
            unit: {
              pattern: '**/*.test.ts',
              timeout: 5000
            },
            integration: {
              pattern: '**/*.integration.test.ts',
              timeout: 10000
            },
            e2e: {
              pattern: '**/*.e2e.test.ts',
              timeout: 30000
            }
          }
        }
      });
    });

    test('should execute test suites', async () => {
      const result = await pipeline.executeTests();
      expect(result.success).toBe(true);
      expect(result.metrics.duration).toBeLessThan(600);
      if (result.metrics.coverage) {
        expect(result.metrics.coverage.statements).toBeGreaterThan(89);
        expect(result.metrics.coverage.branches).toBeGreaterThan(84);
        expect(result.metrics.coverage.functions).toBeGreaterThan(89);
        expect(result.metrics.coverage.lines).toBeGreaterThan(89);
      }
    });
  });

  describe('Deployment Automation', () => {
    let pipeline: Pipeline;
    
    beforeEach(() => {
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
        }
      });
    });

    test('should execute deployment', async () => {
      const result = await pipeline.executeDeploy();
      expect(result.success).toBe(true);
      expect(result.metrics.duration).toBeLessThan(900);
    });

    test('should handle deployment rollback', async () => {
      jest.spyOn(pipeline as any, 'validateDeployment')
        .mockResolvedValueOnce({ valid: false, errorRate: 0.2 });

      const result = await pipeline.executeDeploy();
      expect(result.success).toBe(true);
      if (result.metrics.rollbacks !== undefined) {
        expect(result.metrics.rollbacks).toBe(1);
      }
    });
  });
});