export interface ServicePort {
  port: number;
  targetPort: number;
  protocol: 'TCP' | 'UDP';
  name?: string;
}

export interface HealthCheck {
  path: string;
  port: number;
  initialDelaySeconds: number;
  periodSeconds: number;
  timeoutSeconds: number;
  successThreshold: number;
  failureThreshold: number;
}

export interface ServiceResources {
  cpu: {
    request: string;
    limit: string;
  };
  memory: {
    request: string;
    limit: string;
  };
}

export interface ServiceReplicas {
  min: number;
  max: number;
  target: number;
}

export interface ServiceSpec {
  name: string;
  image: string;
  version: string;
  ports: ServicePort[];
  healthCheck: HealthCheck;
  resources: ServiceResources;
  replicas: ServiceReplicas;
  environment: Record<string, string>;
}

export interface DeploymentConfig {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels?: Record<string, string>;
  };
  spec: ServiceSpec;
}

export interface DeploymentConfigOptions {
  name: string;
  namespace: string;
  image: string;
  version: string;
  ports: ServicePort[];
  healthCheck?: Partial<HealthCheck>;
  resources?: Partial<ServiceResources>;
  replicas?: Partial<ServiceReplicas>;
  environment?: Record<string, string>;
  labels?: Record<string, string>;
}