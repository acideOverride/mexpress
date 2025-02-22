export interface ServiceConfig {
    url: string;
    timeout?: number;
    retries?: number;
}

export interface EnvironmentConfig {
    env: 'development' | 'staging' | 'production';
    debug?: boolean;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    services?: Record<string, ServiceConfig>;
}

export class Environment {
    private config: EnvironmentConfig;
    private readonly defaultServiceConfig: Omit<Required<ServiceConfig>, 'url'> = {
        timeout: 5000,
        retries: 3
    };

    constructor(config: EnvironmentConfig) {
        this.validateConfig(config);
        this.config = this.initializeConfig(config);
    }

    private validateConfig(config: EnvironmentConfig): void {
        if (!config.env) {
            throw new Error('Environment is required');
        }

        if (!['development', 'staging', 'production'].includes(config.env)) {
            throw new Error('Invalid environment specified');
        }

        if (config.logLevel && !['debug', 'info', 'warn', 'error'].includes(config.logLevel)) {
            throw new Error('Invalid log level specified');
        }

        if (config.services) {
            Object.entries(config.services).forEach(([name, service]) => {
                if (!service.url) {
                    throw new Error(`URL is required for service ${name}`);
                }
                if (service.timeout !== undefined && service.timeout < 0) {
                    throw new Error(`Invalid timeout for service ${name}`);
                }
                if (service.retries !== undefined && service.retries < 0) {
                    throw new Error(`Invalid retries for service ${name}`);
                }
            });
        }
    }

    private initializeConfig(config: EnvironmentConfig): EnvironmentConfig {
        return {
            env: config.env,
            debug: config.debug ?? (config.env === 'development'),
            logLevel: config.logLevel ?? (config.env === 'production' ? 'error' : 'info'),
            services: config.services ? this.initializeServices(config.services) : {}
        };
    }

    private initializeServices(services: Record<string, ServiceConfig>): Record<string, Required<ServiceConfig>> {
        const initializedServices: Record<string, Required<ServiceConfig>> = {};
        
        Object.entries(services).forEach(([name, service]) => {
            initializedServices[name] = {
                url: service.url,
                timeout: service.timeout ?? this.defaultServiceConfig.timeout,
                retries: service.retries ?? this.defaultServiceConfig.retries
            };
        });

        return initializedServices;
    }

    getEnvironment(): string {
        return this.config.env;
    }

    isDebugEnabled(): boolean {
        return this.config.debug ?? false;
    }

    getLogLevel(): string {
        return this.config.logLevel ?? 'info';
    }

    getConfig(): EnvironmentConfig {
        return JSON.parse(JSON.stringify(this.config));
    }

    getService(name: string): Required<ServiceConfig> | undefined {
        const service = this.config.services?.[name];
        return service ? JSON.parse(JSON.stringify(service)) : undefined;
    }

    getAllServices(): Map<string, Required<ServiceConfig>> {
        const services = new Map<string, Required<ServiceConfig>>();
        if (this.config.services) {
            Object.entries(this.config.services).forEach(([name, service]) => {
                services.set(name, JSON.parse(JSON.stringify(service)));
            });
        }
        return services;
    }
}