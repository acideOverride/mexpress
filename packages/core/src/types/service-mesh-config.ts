export interface ServiceMeshProxy {
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
}

export interface ServiceMeshRoute {
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
}

export interface ServiceMeshPolicy {
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
}

export interface ServiceMeshMetrics {
  enabled: boolean;
  interval: number;
  retention: number;
  exporters: {
    prometheus?: {
      enabled: boolean;
      port: number;
    };
    jaeger?: {
      enabled: boolean;
      endpoint: string;
      samplingRate: number;
    };
  };
}

export interface ServiceMeshConfig {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels?: Record<string, string>;
  };
  spec: {
    ingress: {
      enabled: boolean;
      port: number;
      tls?: {
        enabled: boolean;
        certFile: string;
        keyFile: string;
      };
    };
    proxies: ServiceMeshProxy[];
    routes: ServiceMeshRoute[];
    policies: ServiceMeshPolicy[];
    metrics: ServiceMeshMetrics;
    discovery: {
      enabled: boolean;
      type: 'kubernetes' | 'consul' | 'static';
      interval: number;
      ttl: number;
    };
  };
}

export interface ServiceMeshConfigOptions {
  name: string;
  namespace: string;
  ingress?: {
    enabled?: boolean;
    port?: number;
    tls?: {
      enabled?: boolean;
      certFile?: string;
      keyFile?: string;
    };
  };
  proxies?: Partial<ServiceMeshProxy>[];
  routes?: Partial<ServiceMeshRoute>[];
  policies?: Partial<ServiceMeshPolicy>[];
  metrics?: Partial<ServiceMeshMetrics>;
  discovery?: {
    enabled?: boolean;
    type?: 'kubernetes' | 'consul' | 'static';
    interval?: number;
    ttl?: number;
  };
  labels?: Record<string, string>;
}