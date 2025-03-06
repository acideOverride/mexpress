import { IstioClient, ServiceMeshConfig } from '../../../src/lib/istio-client';

describe('IstioClient Additional Tests', () => {
    let config: ServiceMeshConfig;
    let istioClient: IstioClient;

    beforeEach(() => {
        config = new ServiceMeshConfig({
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
        });
        istioClient = new IstioClient(config);
    });

    describe('Private Method Coverage', () => {
        it('should validate config before deployment', async () => {
            // @ts-ignore - accessing private method for testing
            const isValid = await istioClient['validateConfig']();
            expect(isValid).toBe(true);
        });

        it('should setup security policies when mTLS is enabled', async () => {
            // @ts-ignore - accessing private method for testing
            await istioClient['setupSecurityPolicies']();
            const result = await istioClient.runE2ETest();
            expect(result.security).toBe('enabled');
        });

        it('should configure monitoring when metrics are enabled', async () => {
            // @ts-ignore - accessing private method for testing
            await istioClient['configureMonitoring']();
            const result = await istioClient.runE2ETest();
            expect(result.monitoring).toBe('active');
        });
    });

    describe('Edge Cases', () => {
        it('should handle complex traffic management configurations', async () => {
            const complexConfig = {
                timeout: 5000,
                retries: 10,
                circuitBreaker: {
                    maxRequests: 1000,
                    consecutiveErrors: 10
                }
            };

            const result = await istioClient.configureTrafficManagement(complexConfig);
            expect(result.status).toBe('success');
            expect(result.config).toEqual(complexConfig);
        });

        it('should handle multiple tracing exporters', async () => {
            const tracingConfig = {
                sampling: 0.5,
                exporters: ['jaeger', 'zipkin', 'datadog', 'stackdriver']
            };

            const result = await istioClient.enableTracing(tracingConfig);
            expect(result.status).toBe('success');
            expect(result.exporters).toEqual(expect.arrayContaining(tracingConfig.exporters));
            expect(result.sampling).toBe(0.5);
        });

        it('should validate all components in e2e test', async () => {
            const result = await istioClient.runE2ETest();
            expect(result.status).toBe('success');
            expect(result.components).toEqual(expect.arrayContaining([
                'control-plane',
                'data-plane'
            ]));
            expect(result.security).toBe('enabled');
            expect(result.monitoring).toBe('active');
        });
    });

    describe('Configuration Validation', () => {
        it('should handle metrics configuration when enabled', async () => {
            const metricsConfig = new ServiceMeshConfig({
                namespace: 'metrics-test',
                version: '1.0.0',
                monitoring: {
                    metrics: true,
                    tracing: false
                },
                security: {
                    mtls: false,
                    authorization: false
                }
            });
            const client = new IstioClient(metricsConfig);
            // @ts-ignore - accessing private method for testing
            await client['configureMonitoring']();
            const result = await client.runE2ETest();
            expect(result.monitoring).toBe('active');
        });

        it('should handle tracing configuration when enabled', async () => {
            const tracingConfig = new ServiceMeshConfig({
                namespace: 'tracing-test',
                version: '1.0.0',
                monitoring: {
                    metrics: false,
                    tracing: true
                },
                security: {
                    mtls: false,
                    authorization: false
                }
            });
            const client = new IstioClient(tracingConfig);
            // @ts-ignore - accessing private method for testing
            await client['configureMonitoring']();
            const result = await client.runE2ETest();
            expect(result.monitoring).toBe('active');
        });
    });
});