import { ServicePort } from './deployment-config';

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
}

export interface ServiceUpdateConfig {
  version?: string;
  replicas?: number;
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
}