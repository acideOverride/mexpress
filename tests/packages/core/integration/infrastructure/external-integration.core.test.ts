import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { IntegrationTester } from './integration-tester';
import { HiboutikService } from './mocks/hiboutik.service';
import { RingoverService } from './mocks/ringover.service';
import { MonitoringSystem } from './mocks/monitoring';
import { CustomerService } from './mocks/customer.service';

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
        // This is the customer import test that was failing - we need to add it
        it('should import multiple customers successfully', async () => {
            // Arrange
            const customerData = [
                {
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
                },
                {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    phone: '+1987654321',
                    address: {
                        street: '456 Oak Ave',
                        city: 'Another City',
                        country: 'Example Country',
                        postalCode: '54321'
                    }
                },
                {
                    firstName: 'Bob',
                    lastName: 'Johnson',
                    email: 'bob.johnson@example.com',
                    phone: '+1122334455',
                    address: {
                        street: '789 Pine St',
                        city: 'Third City',
                        country: 'Example Country',
                        postalCode: '13579'
                    }
                }
            ];
            
            // Create customers in the database
            const customers = await Promise.all(
                customerData.map(data => customerService.createCustomer(data))
            );
            
            // Act
            const result = await integrationTester.testCustomerImport(customers);
            
            // Assert
            expect(result.success).toBe(true);
            expect(result.importedCount).toBe(customerData.length);
            expect(result.failedCount).toBe(0);
            expect(result.errors).toHaveLength(0);
        });
        
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