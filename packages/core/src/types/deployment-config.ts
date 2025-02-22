import { ServiceMeshProxy, ServiceMeshRoute, ServiceMeshPolicy } from './service-mesh-config';

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

export interface DeploymentConfig {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels?: Record<string, string>;
  };
  spec: {
    image: string;
    version: string;
    ports: ServicePort[];
    replicas: number;
    selector: {
      matchLabels: Record<string, string>;
    };
    template: {
      metadata: {
        labels: Record<string, string>;
      };
      spec: {
        containers: {
          name: string;
          image: string;
          ports: ServicePort[];
          healthCheck?: HealthCheck;
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
        }[];
      };
    };
    healthCheck?: HealthCheck;
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
  };
}

export interface DeploymentConfigOptions {
  name: string;
  namespace: string;
  image: string;
  version: string;
  ports: ServicePort[];
  healthCheck?: HealthCheck;
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
  labels?: Record<string, string>;
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
    proxy: ServiceMeshProxy;
    route: ServiceMeshRoute;
    policies: ServiceMeshPolicy[];
  };
}

export interface ServiceMeshConfig {
  proxy: ServiceMeshProxy;
  route: ServiceMeshRoute;
  policies?: ServiceMeshPolicy[];
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
    requests?: {
      cpu?: string;
      memory?: string;
    };
    limits?: {
      cpu?: string;
      memory?: string;
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

export interface ServiceMeshUpdateConfig {
  proxy?: Partial<ServiceMeshProxy>;
  route?: Partial<ServiceMeshRoute>;
  policies?: ServiceMeshPolicy[];
}