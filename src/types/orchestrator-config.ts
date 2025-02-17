import { ServicePort } from './deployment-config';
import { ServiceMeshConfig } from './deployment-config';

export interface OrchestratorConfig {
  clusterName: string;
  namespace: string;
  region: string;
  labels?: Record<string, string>;
}

export interface ServiceConfig {
  name: string;
  image: string;
  version: string;
  ports: ServicePort[];
  replicas?: {
    min?: number;
    max?: number;
    target?: number;
  };
  resources?: {
    cpu?: {
      request?: string;
      limit?: string;
    };
    memory?: {
      request?: string;
      limit?: string;
    };
  };
  mesh?: ServiceMeshConfig;
}

export interface ServiceUpdateConfig {
  version?: string;
  replicas?: number;
  resources?: {
    requests?: {
      cpu?: string;
      memory?: string;
    };
    limits?: {
      cpu?: string;
      memory?: string;
    };
  };
}

export interface ResourceAllocation {
  cpu: {
    total: string;
    allocated: string;
    available: string;
  };
  memory: {
    total: string;
    allocated: string;
    available: string;
  };
  pods: {
    total: number;
    allocated: number;
    available: number;
  };
  nodes: {
    total: number;
    available: number;
    ready: number;
  };
}

export interface ServiceDeploymentStatus {
  status: 'Deployed' | 'Failed' | 'Removed';
  service: {
    name: string;
    version: string;
    replicas: {
      current: number;
      desired: number;
      available: number;
    };
  };
  ha: {
    enabled: boolean;
    status: string;
  };
  runtime: {
    engine: string;
    version: string;
  };
  mesh?: {
    enabled: boolean;
    proxy: {
      name: string;
      port: number;
      protocol: 'http' | 'grpc' | 'tcp';
      timeout: number;
      retries: number;
      circuitBreaker: {
        enabled: boolean;
        threshold: number;
        interval: number;
        timeout: number;
      };
    };
    route: {
      name: string;
      path: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | '*';
      service: string;
      timeout: number;
      retries: number;
      loadBalancer: {
        type: 'round-robin' | 'least-conn' | 'random';
        weight?: number;
      };
    };
    policies: Array<{
      name: string;
      type: 'rate-limit' | 'circuit-breaker' | 'retry' | 'timeout';
      scope: 'global' | 'service' | 'route';
      target?: string;
      config: {
        rateLimit?: {
          requests: number;
          interval: number;
          burst?: number;
        };
        circuitBreaker?: {
          threshold: number;
          interval: number;
          timeout: number;
        };
        retry?: {
          attempts: number;
          backoff: number;
          maxBackoff: number;
        };
        timeout?: {
          connect: number;
          read: number;
          write: number;
        };
      };
    }>;
  };
}