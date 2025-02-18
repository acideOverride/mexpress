import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { IntegrationTester } from '../integration-tester';
import { HiboutikService } from '../../../services/hiboutik.service';
import { RingoverService } from '../../../services/ringover.service';
import { MonitoringSystem } from '../../../lib/monitoring/monitoring';
import { CustomerService } from '../../../services/customer.service';

describe('External Integration Testing', () => {
    let integrationTester: IntegrationTester;
    let hiboutikService: HiboutikService;
    let ringoverService: RingoverService;
    let customerService: CustomerService;
    let monitoring: MonitoringSystem;

    beforeEach(() => {
        hiboutikService = new HiboutikService();
        ringoverService = new RingoverService();
        customerService = new CustomerService();
        monitoring = new MonitoringSystem();
        integrationTester = new IntegrationTester(
            hiboutikService,
            ringoverService,
            customerService,
            monitoring
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
        integrationTester.clearState();
    });

    describe('hiboutik integration', () => {
        it('should sync customer to Hiboutik successfully', async () => {
            // Arrange
            const customer = {
                id: 'cust-123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                address: {
                    street: '123 Main St',
                    city: 'Example City',
                    country: 'Example Country',
                    postalCode: '12345'
                },
                externalIds: {},
                verificationStatus: 'verified' as const,
                syncStatus: 'pending' as const,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Act
            const result = await integrationTester.testHiboutikSync(customer);

            // Assert
            expect(result.success).toBe(true);
            expect(result.externalId).toBeDefined();
            expect(result.errors).toHaveLength(0);
        });

        it('should handle rate limiting during Hiboutik sync', async () => {
            // Arrange
            jest.spyOn(hiboutikService, 'createCustomer').mockRejectedValue(new Error('Rate limit exceeded'));
            const customer = {
                id: 'cust-123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                externalIds: {},
                verificationStatus: 'verified' as const,
                syncStatus: 'pending' as const,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Act
            const result = await integrationTester.testHiboutikSync(customer);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Rate limit exceeded - retry after backoff');
        });

        it('should handle network errors during Hiboutik sync', async () => {
            // Arrange
            jest.spyOn(hiboutikService, 'createCustomer').mockRejectedValue(new Error('Network error'));
            const customer = {
                id: 'cust-123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                externalIds: {},
                verificationStatus: 'verified' as const,
                syncStatus: 'pending' as const,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Act
            const result = await integrationTester.testHiboutikSync(customer);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Network error occurred');
        });
    });

    describe('ringover integration', () => {
        it('should sync customer to Ringover successfully', async () => {
            // Arrange
            const customer = {
                id: 'cust-123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                externalIds: {},
                verificationStatus: 'verified' as const,
                syncStatus: 'pending' as const,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Act
            const result = await integrationTester.testRingoverSync(customer);

            // Assert
            expect(result.success).toBe(true);
            expect(result.externalId).toBeDefined();
            expect(result.errors).toHaveLength(0);
        });

        it('should handle rate limiting during Ringover sync', async () => {
            // Arrange
            jest.spyOn(ringoverService, 'createContact').mockRejectedValue(new Error('Rate limit exceeded'));
            const customer = {
                id: 'cust-123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                externalIds: {},
                verificationStatus: 'verified' as const,
                syncStatus: 'pending' as const,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Act
            const result = await integrationTester.testRingoverSync(customer);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Rate limit exceeded - retry after backoff');
        });

        it('should handle network errors during Ringover sync', async () => {
            // Arrange
            jest.spyOn(ringoverService, 'createContact').mockRejectedValue(new Error('Network error'));
            const customer = {
                id: 'cust-123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                externalIds: {},
                verificationStatus: 'verified' as const,
                syncStatus: 'pending' as const,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Act
            const result = await integrationTester.testRingoverSync(customer);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Network error occurred');
        });
    });

    describe('automation workflows', () => {
        it('should sync customer to both services successfully', async () => {
            // Arrange
            const customerData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                address: {
                    street: '123 Main St',
                    city: 'Example City',
                    country: 'Example Country',
                    postalCode: '12345'
                }
            };
            const customer = await customerService.createCustomer(customerData);
            
            // Act
            const result = await integrationTester.testFullSync(customer);

            // Assert
            expect(result.success).toBe(true);
            expect(result.hiboutikId).toBeDefined();
            expect(result.ringoverId).toBeDefined();
            expect(result.errors).toHaveLength(0);
        });

        it('should handle partial sync failure', async () => {
            // Arrange
            jest.spyOn(ringoverService, 'createContact').mockRejectedValue(new Error('Network error'));
            const customerData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                address: {
                    street: '123 Main St',
                    city: 'Example City',
                    country: 'Example Country',
                    postalCode: '12345'
                }
            };
            const customer = await customerService.createCustomer(customerData);
            
            // Act
            const result = await integrationTester.testFullSync(customer);

            // Assert
            expect(result.success).toBe(false);
            expect(result.hiboutikId).toBeDefined();
            expect(result.ringoverId).toBeUndefined();
            expect(result.errors).toContain('Ringover sync failed: Network error occurred');
        });

        it('should handle complete sync failure', async () => {
            // Arrange
            jest.spyOn(hiboutikService, 'createCustomer').mockRejectedValue(new Error('Network error'));
            jest.spyOn(ringoverService, 'createContact').mockRejectedValue(new Error('Network error'));
            const customerData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                address: {
                    street: '123 Main St',
                    city: 'Example City',
                    country: 'Example Country',
                    postalCode: '12345'
                }
            };
            const customer = await customerService.createCustomer(customerData);
            
            // Act
            const result = await integrationTester.testFullSync(customer);

            // Assert
            expect(result.success).toBe(false);
            expect(result.hiboutikId).toBeUndefined();
            expect(result.ringoverId).toBeUndefined();
            expect(result.errors).toContain('Hiboutik sync failed: Network error occurred');
            expect(result.errors).toContain('Ringover sync failed: Network error occurred');
        });
    });
});