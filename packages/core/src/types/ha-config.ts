export interface LoadBalancerHealthCheck {
  path: string;
  port: number;
  interval: number;
  timeout: number;
  unhealthyThreshold: number;
  healthyThreshold: number;
}

export interface LoadBalancerSessionAffinity {
  enabled: boolean;
  timeout?: number;
}

export interface LoadBalancerConfig {
  type: 'round-robin' | 'least-connections' | 'ip-hash';
  algorithm: string;
  healthCheck: LoadBalancerHealthCheck;
  sessionAffinity: LoadBalancerSessionAffinity;
}

export interface FailoverConfig {
  enabled: boolean;
  timeout: number;
  maxRetries: number;
  backoffMultiplier: number;
  maxBackoffTime: number;
}

export interface ReplicaDistribution {
  zones: string[];
  minPerZone: number;
  maxPerZone: number;
  spreadPolicy: 'balanced' | 'packed';
}

export interface MonitoringThresholds {
  responseTime: number;
  errorRate: number;
  availabilityPercent: number;
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: string[];
  alerting: {
    enabled: boolean;
    thresholds: MonitoringThresholds;
  };
}

export interface HAConfig {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels?: Record<string, string>;
  };
  spec: {
    loadBalancer: LoadBalancerConfig;
    failover: FailoverConfig;
    distribution: ReplicaDistribution;
    monitoring: MonitoringConfig;
  };
}

export interface HAConfigOptions {
  name: string;
  namespace: string;
  loadBalancer?: Partial<{
    type: LoadBalancerConfig['type'];
    algorithm: string;
    healthCheck: Partial<LoadBalancerHealthCheck>;
    sessionAffinity: Partial<LoadBalancerSessionAffinity>;
  }>;
  failover?: Partial<FailoverConfig>;
  distribution?: Partial<ReplicaDistribution>;
  monitoring?: Partial<{
    enabled: boolean;
    metrics: string[];
    alerting: Partial<{
      enabled: boolean;
      thresholds: Partial<MonitoringThresholds>;
    }>;
  }>;
  labels?: Record<string, string>;
}