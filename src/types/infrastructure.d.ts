declare module '../lib/istio-client' {
  export interface IstioClient {
    deployControlPlane(): Promise<{
      status: string;
      components: string[];
    }>;

    configureTrafficManagement(config: {
      timeout: number;
      retries: number;
      circuitBreaker: {
        maxRequests: number;
        consecutiveErrors: number;
      };
    }): Promise<{
      status: string;
      config: any;
    }>;

    enableTracing(config: {
      sampling: number;
      exporters: string[];
    }): Promise<{
      status: string;
      sampling: number;
      exporters: string[];
    }>;

    runE2ETest(): Promise<{
      status: string;
      components: string[];
      security: string;
      monitoring: string;
    }>;
  }
}

declare module '../lib/monitoring' {
  export interface MonitoringClient {
    configureMetrics(config: {
      prometheus: boolean;
      customMetrics: string[];
    }): Promise<{
      status: string;
      metrics: string[];
    }>;

    runPerformanceTest(): Promise<{
      responseTime: number;
      latency: number;
      throughput?: number;
      errorRate?: number;
    }>;
  }
}

declare module '../lib/security' {
  export interface SecurityConfig {
    enableMTLS(): Promise<{
      status: string;
      mode: string;
    }>;

    configureAuthorization(config: {
      default: string;
      rules: Array<{
        from: string;
        to: string;
        methods: string[];
      }>;
    }): Promise<{
      status: string;
      policies: Array<{
        from: string;
        to: string;
        methods: string[];
      }>;
    }>;
  }
}

declare module '../lib/config' {
  export interface ServiceMeshConfigOptions {
    namespace: string;
    version: string;
    monitoring: {
      metrics: boolean;
      tracing: boolean;
    };
    security: {
      mtls: boolean;
      authorization: boolean;
    };
  }

  export class ServiceMeshConfig {
    constructor(options: ServiceMeshConfigOptions);
    getNamespace(): string;
    getVersion(): string;
    isMetricsEnabled(): boolean;
    isTracingEnabled(): boolean;
    isMTLSEnabled(): boolean;
    isAuthorizationEnabled(): boolean;
    getConfig(): ServiceMeshConfigOptions;
  }
}