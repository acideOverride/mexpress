import { ServiceMeshConfig, ServiceMeshConfigOptions } from '../../lib/config';

describe('ServiceMeshConfig', () => {
    let config: ServiceMeshConfig;
    const defaultOptions: ServiceMeshConfigOptions = {
        namespace: 'test-namespace',
        version: '1.0.0',
        monitoring: {
            metrics: true,
            tracing: true
        },
        security: {
            mtls: true,
            authorization: true
        }
    };

    beforeEach(() => {
        config = new ServiceMeshConfig(defaultOptions);
    });

    describe('Basic Configuration', () => {
        test('should correctly initialize with options', () => {
            expect(config.getNamespace()).toBe(defaultOptions.namespace);
            expect(config.getVersion()).toBe(defaultOptions.version);
            expect(config.isMetricsEnabled()).toBe(defaultOptions.monitoring.metrics);
            expect(config.isTracingEnabled()).toBe(defaultOptions.monitoring.tracing);
            expect(config.isMTLSEnabled()).toBe(defaultOptions.security.mtls);
            expect(config.isAuthorizationEnabled()).toBe(defaultOptions.security.authorization);
        });

        test('should return complete configuration', () => {
            const fullConfig = config.getConfig();
            expect(fullConfig).toEqual(defaultOptions);
        });

        test('should create deep copy of monitoring and security settings', () => {
            const fullConfig = config.getConfig();
            fullConfig.monitoring.metrics = false;
            fullConfig.security.mtls = false;
            
            expect(config.isMetricsEnabled()).toBe(true);
            expect(config.isMTLSEnabled()).toBe(true);
        });
    });

    describe('Validation', () => {
        test('should throw error for missing namespace', () => {
            expect(() => new ServiceMeshConfig({
                ...defaultOptions,
                namespace: ''
            })).toThrow('Namespace is required');
        });

        test('should throw error for missing version', () => {
            expect(() => new ServiceMeshConfig({
                ...defaultOptions,
                version: ''
            })).toThrow('Version is required');
        });

        test('should throw error for invalid monitoring config', () => {
            expect(() => new ServiceMeshConfig({
                ...defaultOptions,
                monitoring: undefined as any
            })).toThrow('Monitoring configuration is required');
        });

        test('should throw error for invalid security config', () => {
            expect(() => new ServiceMeshConfig({
                ...defaultOptions,
                security: undefined as any
            })).toThrow('Security configuration is required');
        });
    });

    describe('Default Values', () => {
        test('should use default monitoring values if not provided', () => {
            const configWithoutMonitoring = new ServiceMeshConfig({
                namespace: 'test',
                version: '1.0.0',
                monitoring: {} as any,
                security: defaultOptions.security
            });

            expect(configWithoutMonitoring.isMetricsEnabled()).toBe(false);
            expect(configWithoutMonitoring.isTracingEnabled()).toBe(false);
        });

        test('should use default security values if not provided', () => {
            const configWithoutSecurity = new ServiceMeshConfig({
                namespace: 'test',
                version: '1.0.0',
                monitoring: defaultOptions.monitoring,
                security: {} as any
            });

            expect(configWithoutSecurity.isMTLSEnabled()).toBe(false);
            expect(configWithoutSecurity.isAuthorizationEnabled()).toBe(false);
        });
    });
});
