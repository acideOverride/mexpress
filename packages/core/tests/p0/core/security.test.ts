import { ServiceMeshConfig } from '../../../../../packages/utils/src/lib/config';
import { SecurityConfig } from '../../../../../packages/utils/src/lib/security';

// BRQ: MEXP-2025-002-BE - Authentication & Security
describe('SecurityConfig', () => {
    let config: ServiceMeshConfig;
    let securityConfig: SecurityConfig;

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
        securityConfig = new SecurityConfig(config);
    });

    describe('mTLS Configuration', () => {
        it('should enable mTLS when configured', async () => {
            const result = await securityConfig.enableMTLS();
            expect(result.status).toBe('success');
            expect(result.mode).toBe('STRICT');
        });

        it('should throw error when mTLS is not enabled in config', async () => {
            const disabledConfig = new ServiceMeshConfig({
                namespace: 'test-namespace',
                version: '1.0.0',
                monitoring: {
                    metrics: true,
                    tracing: true
                },
                security: {
                    mtls: false,
                    authorization: true
                }
            });
            const secConfig = new SecurityConfig(disabledConfig);
            
            await expect(secConfig.enableMTLS()).rejects.toThrow('mTLS is not enabled in configuration');
        });
    });

    describe('Authorization Configuration', () => {
        it('should configure authorization policies', async () => {
            const authConfig = {
                default: 'deny-all',
                rules: [
                    {
                        from: 'service-a',
                        to: 'service-b',
                        methods: ['GET', 'POST']
                    }
                ]
            };

            const result = await securityConfig.configureAuthorization(authConfig);
            expect(result.status).toBe('success');
            expect(result.policies).toEqual(authConfig.rules);
        });

        it('should throw error when authorization is not enabled', async () => {
            const disabledConfig = new ServiceMeshConfig({
                namespace: 'test-namespace',
                version: '1.0.0',
                monitoring: {
                    metrics: true,
                    tracing: true
                },
                security: {
                    mtls: true,
                    authorization: false
                }
            });
            const secConfig = new SecurityConfig(disabledConfig);
            
            const authConfig = {
                default: 'deny-all',
                rules: []
            };

            await expect(secConfig.configureAuthorization(authConfig))
                .rejects.toThrow('Authorization is not enabled in configuration');
        });

        it('should validate authorization config default policy', async () => {
            const invalidConfig = {
                default: 'invalid-policy',
                rules: [
                    {
                        from: 'service-a',
                        to: 'service-b',
                        methods: ['GET']
                    }
                ]
            };

            await expect(securityConfig.configureAuthorization(invalidConfig))
                .rejects.toThrow('Invalid default authorization policy');
        });

        it('should validate authorization rules exist', async () => {
            const invalidConfig = {
                default: 'deny-all',
                rules: []
            };

            await expect(securityConfig.configureAuthorization(invalidConfig))
                .rejects.toThrow('Authorization rules must be provided');
        });

        it('should configure multiple authorization rules', async () => {
            const authConfig = {
                default: 'deny-all',
                rules: [
                    {
                        from: 'service-a',
                        to: 'service-b',
                        methods: ['GET']
                    },
                    {
                        from: 'service-b',
                        to: 'service-c',
                        methods: ['POST', 'PUT']
                    }
                ]
            };

            const result = await securityConfig.configureAuthorization(authConfig);
            expect(result.status).toBe('success');
            expect(result.policies).toHaveLength(2);
            expect(result.policies).toEqual(authConfig.rules);
        });
    });
});