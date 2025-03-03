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