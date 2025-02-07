export interface ResourceRequirements {
  requests: {
    cpu: string;
    memory: string;
  };
  limits: {
    cpu: string;
    memory: string;
  };
}

export interface NetworkConfig {
  serviceCIDR: string;
  podCIDR: string;
  provider: string;
}

export interface SecurityConfig {
  rbacEnabled: boolean;
  networkPoliciesEnabled: boolean;
  podSecurityPolicies: string[];
  networkPolicies: string[];
  admissionControllers: string[];
  auditLogging: boolean;
}

export interface ClusterSpec {
  version: string;
  highAvailability: boolean;
  replicas: number;
  controlPlane: {
    replicas: number;
  };
  etcd: {
    replicas: number;
  };
  resources: ResourceRequirements;
  networking: NetworkConfig;
  security: SecurityConfig;
}

export interface ClusterConfig {
  apiVersion: string;
  kind: string;
  metadata: {
    namespace: string;
    name?: string;
  };
  spec: ClusterSpec;
}

export interface KubernetesConfigOptions {
  namespace: string;
  version: string;
  highAvailability: boolean;
  network?: {
    serviceCIDR: string;
    podCIDR: string;
  };
  security?: {
    rbacEnabled: boolean;
    networkPoliciesEnabled: boolean;
  };
}