import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { CustomerTester } from '../customer-tester';
import { CustomerService } from '../customer.service';
import { MonitoringSystem } from '../../../lib/monitoring/monitoring';

describe('Customer Management Testing', () => {
    let customerTester: CustomerTester;
    let customerService: CustomerService;
    let monitoring: MonitoringSystem;

    beforeEach(() => {
        customerService = new CustomerService();
        monitoring = new MonitoringSystem();
        customerTester = new CustomerTester(customerService, monitoring);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        customerTester.clearState();
    });

    describe('customer creation', () => {
        it('should successfully create customer with valid data', async () => {
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
            
            // Act
            const result = await customerTester.testCreateCustomer(customerData);

            // Assert
            expect(result.success).toBe(true);
            expect(result.customer).toBeDefined();
            if (result.customer) {
                expect(result.customer.id).toBeDefined();
            }
            expect(result.errors).toHaveLength(0);
        });

        it('should fail customer creation with invalid email', async () => {
            // Arrange
            const customerData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email',
                phone: '+1234567890',
                address: {
                    street: '123 Main St',
                    city: 'Example City',
                    country: 'Example Country',
                    postalCode: '12345'
                }
            };
            
            // Act
            const result = await customerTester.testCreateCustomer(customerData);

            // Assert
            expect(result.success).toBe(false);
            expect(result.customer).toBeUndefined();
            expect(result.errors).toContain('Invalid email format');
        });

        it('should fail customer creation with missing required fields', async () => {
            // Arrange
            const customerData = {
                lastName: 'Doe'
            };
            
            // Act
            const result = await customerTester.testCreateCustomer(customerData);

            // Assert
            expect(result.success).toBe(false);
            expect(result.customer).toBeUndefined();
            expect(result.errors[0]).toContain('Missing required fields: firstName, email');
        });

        it('should handle network errors during customer creation', async () => {
            // Arrange
            jest.spyOn(customerService, 'create').mockRejectedValue(new Error('Network error'));
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
            
            // Act
            const result = await customerTester.testCreateCustomer(customerData);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Network error occurred');
        });
    });

    describe('customer search', () => {
        it('should find customer by exact email', async () => {
            // Arrange
            const searchCriteria = {
                email: 'john.doe@example.com'
            };
            
            // Act
            const result = await customerTester.testSearchCustomer(searchCriteria);

            // Assert
            expect(result.success).toBe(true);
            expect(result.customers).toBeDefined();
            if (result.customers && result.customers.length > 0) {
                expect(result.customers[0].email).toBe(searchCriteria.email);
            }
        });

        it('should find customers by partial name match', async () => {
            // Arrange
            const searchCriteria = {
                name: 'John'
            };
            
            // Act
            const result = await customerTester.testSearchCustomer(searchCriteria);

            // Assert
            expect(result.success).toBe(true);
            expect(result.customers).toBeDefined();
            if (result.customers && result.customers.length > 0) {
                expect(result.customers[0].firstName).toContain(searchCriteria.name);
            }
        });

        it('should handle no results found', async () => {
            // Arrange
            const searchCriteria = {
                email: 'nonexistent@example.com'
            };
            
            // Act
            const result = await customerTester.testSearchCustomer(searchCriteria);

            // Assert
            expect(result.success).toBe(true);
            expect(result.customers).toBeDefined();
            expect(result.customers).toHaveLength(0);
            expect(result.message).toBe('No customers found');
        });

        it('should handle invalid search criteria', async () => {
            // Arrange
            const searchCriteria = {};
            
            // Act
            const result = await customerTester.testSearchCustomer(searchCriteria);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Invalid search criteria');
        });

        it('should handle network errors during search', async () => {
            // Arrange
            jest.spyOn(customerService, 'search').mockRejectedValue(new Error('Network error'));
            const searchCriteria = {
                email: 'john.doe@example.com'
            };
            
            // Act
            const result = await customerTester.testSearchCustomer(searchCriteria);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Network error occurred');
        });
    });

    describe('data validation', () => {
        it('should validate phone number format', async () => {
            // Arrange
            const customerData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: 'invalid-phone',
                address: {
                    street: '123 Main St',
                    city: 'Example City',
                    country: 'Example Country',
                    postalCode: '12345'
                }
            };
            
            // Act
            const result = await customerTester.testCreateCustomer(customerData);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Invalid phone number format');
        });

        it('should validate postal code format', async () => {
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
                    postalCode: '@#$'  // Invalid postal code
                }
            };
            
            // Act
            const result = await customerTester.testCreateCustomer(customerData);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toContain('Invalid postal code format');
        });
    });
});