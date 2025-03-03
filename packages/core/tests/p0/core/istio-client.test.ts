import { IstioClient, ServiceMeshConfig } from '../../lib/istio-client';

describe('IstioClient', () => {
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

    describe('Traffic Management', () => {
        it('should configure traffic management with timeouts', async () => {
            const trafficConfig = {
                timeout: 2000,
                retries: 3,
                circuitBreaker: {
                    maxRequests: 100,
                    consecutiveErrors: 5
                }
            };

            const result = await istioClient.configureTrafficManagement(trafficConfig);
            expect(result.status).toBe('success');
            expect(result.config).toEqual(trafficConfig);
        });

        it('should configure traffic management with circuit breaker', async () => {
            const trafficConfig = {
                timeout: 1000,
                retries: 5,
                circuitBreaker: {
                    maxRequests: 200,
                    consecutiveErrors: 3
                }
            };

            const result = await istioClient.configureTrafficManagement(trafficConfig);
            expect(result.status).toBe('success');
            expect(result.config.circuitBreaker).toEqual(trafficConfig.circuitBreaker);
        });
    });

    describe('Tracing Configuration', () => {
        it('should enable tracing with custom sampling rate', async () => {
            const tracingConfig = {
                sampling: 0.25,
                exporters: ['jaeger', 'zipkin']
            };

            const result = await istioClient.enableTracing(tracingConfig);
            expect(result.status).toBe('success');
            expect(result.sampling).toBe(0.25);
            expect(result.exporters).toContain('jaeger');
            expect(result.exporters).toContain('zipkin');
        });

        it('should enable tracing with minimal configuration', async () => {
            const tracingConfig = {
                sampling: 0.1,
                exporters: ['jaeger']
            };

            const result = await istioClient.enableTracing(tracingConfig);
            expect(result.status).toBe('success');
            expect(result.sampling).toBe(0.1);
            expect(result.exporters).toHaveLength(1);
        });
    });

    describe('End-to-End Testing', () => {
        it('should run comprehensive e2e tests', async () => {
            const result = await istioClient.runE2ETest();
            expect(result.status).toBe('success');
            expect(result.components).toContain('control-plane');
            expect(result.components).toContain('data-plane');
            expect(result.security).toBe('enabled');
            expect(result.monitoring).toBe('active');
        });

        it('should validate all components during e2e test', async () => {
            const result = await istioClient.runE2ETest();
            expect(result.components).toEqual(
                expect.arrayContaining(['control-plane', 'data-plane'])
            );
            expect(result.components.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('Control Plane Deployment', () => {
        it('should deploy control plane with default components', async () => {
            const result = await istioClient.deployControlPlane();
            expect(result.status).toBe('success');
            expect(result.components).toContain('istiod');
            expect(result.components).toContain('ingress-gateway');
        });

        it('should deploy control plane with all required components', async () => {
            const result = await istioClient.deployControlPlane();
            expect(result.components).toEqual(
                expect.arrayContaining(['istiod', 'ingress-gateway'])
            );
            expect(result.components.length).toBeGreaterThanOrEqual(2);
        });
    });
});