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
    private readonly namespace: string;
    private readonly version: string;
    private readonly monitoring: {
        metrics: boolean;
        tracing: boolean;
    };
    private readonly security: {
        mtls: boolean;
        authorization: boolean;
    };

    constructor(options: ServiceMeshConfigOptions) {
        this.namespace = options.namespace;
        this.version = options.version;
        this.monitoring = options.monitoring;
        this.security = options.security;
    }

    getNamespace(): string {
        return this.namespace;
    }

    getVersion(): string {
        return this.version;
    }

    isMetricsEnabled(): boolean {
        return this.monitoring.metrics;
    }

    isTracingEnabled(): boolean {
        return this.monitoring.tracing;
    }

    isMTLSEnabled(): boolean {
        return this.security.mtls;
    }

    isAuthorizationEnabled(): boolean {
        return this.security.authorization;
    }

    getConfig(): ServiceMeshConfigOptions {
        return {
            namespace: this.namespace,
            version: this.version,
            monitoring: { ...this.monitoring },
            security: { ...this.security }
        };
    }
}