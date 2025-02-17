export interface EnvironmentConfig {
    env: 'development' | 'staging' | 'production';
    debug?: boolean;
    logLevel?: 'error' | 'warn' | 'info' | 'debug';
    services?: {
        [key: string]: {
            url: string;
            timeout?: number;
            retries?: number;
        };
    };
}

export class Environment {
    private readonly env: string;
    private readonly debug: boolean;
    private readonly logLevel: string;
    private readonly services: Map<string, {
        url: string;
        timeout: number;
        retries: number;
    }>;

    constructor(config: EnvironmentConfig) {
        this.validateConfig(config);

        this.env = config.env;
        this.debug = config.debug ?? (config.env === 'development');
        this.logLevel = config.logLevel ?? (config.env === 'production' ? 'error' : 'info');
        
        // Initialize services with defaults
        this.services = new Map();
        if (config.services) {
            Object.entries(config.services).forEach(([name, service]) => {
                this.services.set(name, {
                    url: service.url,
                    timeout: service.timeout ?? 5000,
                    retries: service.retries ?? 3
                });
            });
        }
    }

    private validateConfig(config: EnvironmentConfig): void {
        if (!config.env) {
            throw new Error('Environment is required');
        }
        if (!['development', 'staging', 'production'].includes(config.env)) {
            throw new Error('Invalid environment specified');
        }
        if (config.logLevel && !['error', 'warn', 'info', 'debug'].includes(config.logLevel)) {
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

    getEnvironment(): string {
        return this.env;
    }

    isDebugEnabled(): boolean {
        return this.debug;
    }

    getLogLevel(): string {
        return this.logLevel;
    }

    getService(name: string): { url: string; timeout: number; retries: number } | undefined {
        const service = this.services.get(name);
        if (!service) return undefined;
        
        // Return deep copy
        return { ...service };
    }

    getAllServices(): Map<string, { url: string; timeout: number; retries: number }> {
        // Create new map with deep copies of each service
        const services = new Map();
        this.services.forEach((service, name) => {
            services.set(name, { ...service });
        });
        return services;
    }

    getConfig(): EnvironmentConfig {
        // Convert services map to object with deep copies
        const services: EnvironmentConfig['services'] = {};
        this.services.forEach((service, name) => {
            services[name] = { ...service };
        });

        return {
            env: this.env as 'development' | 'staging' | 'production',
            debug: this.debug,
            logLevel: this.logLevel as 'error' | 'warn' | 'info' | 'debug',
            services
        };
    }
}