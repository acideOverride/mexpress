export interface ResourceLimits {
  memory: {
    limit: string;
    reservation: string;
  };
  cpu: {
    limit: string;
    shares: number;
  };
  pids: {
    limit: number;
  };
}

export interface LifecycleConfig {
  stopTimeout: number;
  startTimeout: number;
  killTimeout: number;
}

export interface RuntimeSpec {
  engine: string;
  version: string;
  rootDir: string;
  maxContainers: number;
  resources: ResourceLimits;
  lifecycle: LifecycleConfig;
}

export interface RuntimeConfig {
  apiVersion: string;
  kind: string;
  spec: RuntimeSpec;
}

export interface RuntimeConfigOptions {
  engine: string;
  version: string;
  rootDir: string;
  maxContainers: number;
  resources?: {
    memory?: {
      limit?: string;
      reservation?: string;
    };
    cpu?: {
      limit?: string;
      shares?: number;
    };
    pids?: {
      limit?: number;
    };
  };
  lifecycle?: {
    stopTimeout?: number;
    startTimeout?: number;
    killTimeout?: number;
  };
}