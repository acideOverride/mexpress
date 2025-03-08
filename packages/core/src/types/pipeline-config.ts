export type PipelineStage = 'lint' | 'test' | 'build' | 'deploy';

export interface StageMetrics {
  cpu: number;
  memory: number;
  duration: number;
  coverage?: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  rollbacks?: number;
}

export interface StageConfig {
  name: PipelineStage;
  timeout: number;
  retries: number;
  parallel: boolean;
  dependencies: PipelineStage[];
  environment: Record<string, string>;
  cache?: {
    key: string;
    paths: string[];
    policy: 'pull' | 'push' | 'pull-push';
  };
}

export interface BuildConfig {
  tool: string;
  version: string;
  args: string[];
  dockerfile?: string;
  context?: string;
  cache: {
    enabled: boolean;
    layers: boolean;
    dependencies: boolean;
  };
  output: {
    path: string;
    artifacts: string[];
  };
}

export interface TestConfig {
  framework: string;
  runner: string;
  coverage: {
    tool: string;
    threshold: {
      statements: number;
      branches: number;
      functions: number;
      lines: number;
    };
    excludePaths: string[];
  };
  suites: {
    unit: {
      pattern: string;
      timeout: number;
    };
    integration: {
      pattern: string;
      timeout: number;
    };
    e2e: {
      pattern: string;
      timeout: number;
    };
  };
}

export interface DeploymentConfig {
  strategy: 'rolling' | 'blue-green' | 'canary';
  environment: string;
  replicas: number;
  healthCheck: {
    path: string;
    port: number;
    initialDelay: number;
    period: number;
    timeout: number;
    successThreshold: number;
    failureThreshold: number;
  };
  rollback: {
    enabled: boolean;
    timeout: number;
    criteria: {
      errorRate: number;
      latency: number;
    };
  };
  resources: {
    limits: {
      cpu: string;
      memory: string;
    };
    requests: {
      cpu: string;
      memory: string;
    };
  };
}

export interface PipelineConfig {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels?: Record<string, string>;
  };
  spec: {
    stages: StageConfig[];
    build: BuildConfig;
    test: TestConfig;
    deployment: DeploymentConfig;
    monitoring: {
      metrics: {
        buildTime: number;
        testTime: number;
        deployTime: number;
        successRate: number;
      };
      alerts: {
        buildFailure: boolean;
        testFailure: boolean;
        deploymentFailure: boolean;
        performanceThreshold: boolean;
      };
    };
  };
}

export interface PipelineConfigOptions {
  name: string;
  namespace: string;
  stages?: Partial<Omit<StageConfig, 'name'> & { name: PipelineStage }>[];
  build?: Partial<BuildConfig>;
  test?: Partial<TestConfig>;
  deployment?: Partial<DeploymentConfig>;
  monitoring?: {
    metrics?: {
      buildTime?: number;
      testTime?: number;
      deployTime?: number;
      successRate?: number;
    };
    alerts?: {
      buildFailure?: boolean;
      testFailure?: boolean;
      deploymentFailure?: boolean;
      performanceThreshold?: boolean;
    };
  };
  labels?: Record<string, string>;
  infrastructure?: {
    orchestrator?: any;
    serviceMesh?: any;
    runtime?: any;
    deployment?: any;
  };
}

export interface PipelineValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StageExecutionResult {
  stage: PipelineStage;
  success: boolean;
  duration: number;
  error?: string;
  artifacts?: string[];
  metrics: StageMetrics;
}

export interface PipelineExecutionResult {
  pipelineId: string;
  status: 'success' | 'failure' | 'in_progress';
  stages: StageExecutionResult[];
  startTime: Date;
  endTime?: Date;
  duration: number;
  metrics: {
    totalTime: number;
    buildTime: number;
    testTime: number;
    deployTime: number;
    successRate: number;
  };
}