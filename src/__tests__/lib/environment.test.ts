import { Environment, EnvironmentConfig } from '../../lib/environment';

describe('Environment', () => {
    let defaultConfig: EnvironmentConfig;

    beforeEach(() => {
        defaultConfig = {
            env: 'development',
            debug: true,
            logLevel: 'info',
            services: {
                auth: {
                    url: 'http://auth-service',
                    timeout: 5000,
                    retries: 3
                }
            }
        };
    });

    describe('Basic Configuration', () => {
        test('should correctly initialize with config', () => {
            const env = new Environment(defaultConfig);
            expect(env.getEnvironment()).toBe('development');
            expect(env.isDebugEnabled()).toBe(true);
            expect(env.getLogLevel()).toBe('info');
        });

        test('should return complete configuration', () => {
            const env = new Environment(defaultConfig);
            const config = env.getConfig();
            expect(config).toEqual(defaultConfig);
        });

        test('should create deep copy of services', () => {
            const env = new Environment(defaultConfig);
            const config = env.getConfig();
            config.services!.auth.timeout = 1000;
            
            const service = env.getService('auth');
            expect(service?.timeout).toBe(5000);
        });
    });

    describe('Environment Validation', () => {
        test('should throw error for missing environment', () => {
            expect(() => new Environment({} as EnvironmentConfig))
                .toThrow('Environment is required');
        });

        test('should throw error for invalid environment', () => {
            expect(() => new Environment({
                env: 'invalid' as any
            })).toThrow('Invalid environment specified');
        });

        test('should throw error for invalid log level', () => {
            expect(() => new Environment({
                env: 'development',
                logLevel: 'invalid' as any
            })).toThrow('Invalid log level specified');
        });
    });

    describe('Default Values', () => {
        test('should set debug based on environment', () => {
            const devEnv = new Environment({ env: 'development' });
            expect(devEnv.isDebugEnabled()).toBe(true);

            const prodEnv = new Environment({ env: 'production' });
            expect(prodEnv.isDebugEnabled()).toBe(false);
        });

        test('should set log level based on environment', () => {
            const devEnv = new Environment({ env: 'development' });
            expect(devEnv.getLogLevel()).toBe('info');

            const prodEnv = new Environment({ env: 'production' });
            expect(prodEnv.getLogLevel()).toBe('error');
        });

        test('should use default service settings', () => {
            const env = new Environment({
                env: 'development',
                services: {
                    test: {
                        url: 'http://test'
                    }
                }
            });

            const service = env.getService('test');
            expect(service).toEqual({
                url: 'http://test',
                timeout: 5000,
                retries: 3
            });
        });
    });

    describe('Service Configuration', () => {
        test('should throw error for missing service URL', () => {
            expect(() => new Environment({
                env: 'development',
                services: {
                    test: {} as any
                }
            })).toThrow('URL is required for service test');
        });

        test('should throw error for invalid timeout', () => {
            expect(() => new Environment({
                env: 'development',
                services: {
                    test: {
                        url: 'http://test',
                        timeout: -1
                    }
                }
            })).toThrow('Invalid timeout for service test');
        });

        test('should throw error for invalid retries', () => {
            expect(() => new Environment({
                env: 'development',
                services: {
                    test: {
                        url: 'http://test',
                        retries: -1
                    }
                }
            })).toThrow('Invalid retries for service test');
        });

        test('should get all services', () => {
            const env = new Environment(defaultConfig);
            const services = env.getAllServices();
            expect(services.size).toBe(1);
            expect(services.get('auth')).toEqual({
                url: 'http://auth-service',
                timeout: 5000,
                retries: 3
            });
        });

        test('should handle missing service', () => {
            const env = new Environment(defaultConfig);
            expect(env.getService('unknown')).toBeUndefined();
        });
    });
});