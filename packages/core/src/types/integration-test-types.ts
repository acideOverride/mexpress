import { DeploymentConfig } from './deployment-config';

export interface Resource {
  name: string;
  type: string;
  version?: string;
}

export interface ServiceConfig {
  service: string;
  routing: RoutingConfig;
  security: SecurityConfig;
}

export interface RoutingConfig {
  destinations: Array<{
    version: string;
    weight: number;
  }>;
}

export interface SecurityConfig {
  tls: boolean;
  mtls: boolean;
  policies: string[];
}

export interface TrafficRouting {
  destinations: Array<{
    version: string;
    weight: number;
  }>;
}

export interface ContainerImage {
  name: string;
  tag: string;
  digest?: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

export interface DeploymentStatus {
  phase: string;
  availableReplicas: number;
  conditions: Array<{
    type: string;
    status: string;
    reason?: string;
  }>;
}

export interface HealthCheckResult {
  healthy: boolean;
  errorRate: number;
}

// Component Interfaces
export interface IContainerOrchestrator {
  initialize(): Promise<void>;
  listResources(): Promise<Resource[]>;
  validateDeployment(name: string): Promise<{ valid: boolean; errorRate: number }>;
}

export interface IServiceMesh {
  initialize(): Promise<void>;
  getServiceConfig(service: string): Promise<ServiceConfig>;
  getTrafficRouting(service: string): Promise<TrafficRouting>;
}

export interface IContainerRuntime {
  initialize(): Promise<void>;
  setupCache(): Promise<void>;
  listImages(): Promise<ContainerImage[]>;
  getCacheStats(): Promise<CacheStats>;
}

export interface IServiceDeployment {
  initialize(): Promise<void>;
  getStatus(name: string): Promise<DeploymentStatus>;
  validateHealth(name: string): Promise<HealthCheckResult>;
  getDeploymentConfig(): DeploymentConfig;
}

// Configuration Types
export interface OrchestratorConfig {
  name: string;
  namespace: string;
  cluster?: string;
}

export interface ServiceMeshConfig {
  name: string;
  namespace: string;
  mtls?: boolean;
}

export interface RuntimeConfig {
  name: string;
  namespace: string;
  cacheSize?: number;
}

export interface DeploymentTestConfig {
  name: string;
  namespace: string;
  image: string;
  version: string;
  ports: number[];
}