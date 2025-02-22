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
        this.validateOptions(options);
        
        this.namespace = options.namespace;
        this.version = options.version;
        this.monitoring = {
            metrics: options.monitoring?.metrics ?? false,
            tracing: options.monitoring?.tracing ?? false
        };
        this.security = {
            mtls: options.security?.mtls ?? false,
            authorization: options.security?.authorization ?? false
        };
    }

    private validateOptions(options: ServiceMeshConfigOptions): void {
        if (!options.namespace) {
            throw new Error('Namespace is required');
        }
        if (!options.version) {
            throw new Error('Version is required');
        }
        if (!options.monitoring) {
            throw new Error('Monitoring configuration is required');
        }
        if (!options.security) {
            throw new Error('Security configuration is required');
        }
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