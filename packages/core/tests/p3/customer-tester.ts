import { CustomerService, ICustomer as Customer } from './customer.service';
import { MonitoringSystem } from '../../lib/monitoring/monitoring';

export interface CustomerData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        country?: string;
        postalCode?: string;
    };
}

export interface SearchCriteria {
    name?: string;
    email?: string;
    phone?: string;
}

export interface CustomerTestResult {
    success: boolean;
    customer?: Customer;
    customers?: Customer[];
    message?: string;
    errors: string[];
}

export class CustomerTester {
    constructor(
        private readonly customerService: CustomerService,
        private readonly monitoring: MonitoringSystem
    ) {}

    async testCreateCustomer(customerData: CustomerData): Promise<CustomerTestResult> {
        try {
            // Validate required fields
            const missingFields = [];
            if (!customerData.firstName) missingFields.push('firstName');
            if (!customerData.email) missingFields.push('email');
            
            if (missingFields.length > 0) {
                return {
                    success: false,
                    errors: [`Missing required fields: ${missingFields.join(', ')}`]
                };
            }

            // Validate email format
            if (customerData.email && !this.validateEmail(customerData.email)) {
                return {
                    success: false,
                    errors: ['Invalid email format']
                };
            }

            // Validate phone format if provided
            if (customerData.phone && !this.validatePhone(customerData.phone)) {
                return {
                    success: false,
                    errors: ['Invalid phone number format']
                };
            }

            // Validate postal code if provided
            if (customerData.address?.postalCode && !this.validatePostalCode(customerData.address.postalCode)) {
                return {
                    success: false,
                    errors: ['Invalid postal code format']
                };
            }

            // Create customer
            const customer = await this.customerService.create(customerData as any);
            
            await this.monitoring.incrementCounter('customer_create_total', { status: 'success' });
            
            return {
                success: true,
                customer,
                errors: []
            };
        } catch (error) {
            await this.monitoring.incrementCounter('customer_create_total', { status: 'error' });
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                errors: [errorMessage.includes('Network')
                    ? 'Network error occurred'
                    : errorMessage]
            };
        }
    }

    async testSearchCustomer(criteria: SearchCriteria): Promise<CustomerTestResult> {
        try {
            // Validate search criteria
            if (!criteria.email && !criteria.name && !criteria.phone) {
                return {
                    success: false,
                    errors: ['Invalid search criteria']
                };
            }

            // Search customers - adapt the params for our search method
            const searchParam = criteria.email || criteria.name || criteria.phone || '';
            const customers = await this.customerService.search({ query: searchParam });
            
            await this.monitoring.incrementCounter('customer_search_total', { status: 'success' });
            
            return {
                success: true,
                customers,
                message: customers.length === 0 ? 'No customers found' : undefined,
                errors: []
            };
        } catch (error) {
            await this.monitoring.incrementCounter('customer_search_total', { status: 'error' });
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                errors: [errorMessage.includes('Network')
                    ? 'Network error occurred'
                    : errorMessage]
            };
        }
    }

    clearState(): void {
        // Clear any test state
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validatePhone(phone: string): boolean {
        const phoneRegex = /^[+]?[\d\s-()]{7,15}$/;
        return phoneRegex.test(phone);
    }

    private validatePostalCode(code: string): boolean {
        const postalCodeRegex = /^[\dA-Za-z\s-]{3,10}$/;
        return postalCodeRegex.test(code);
    }
}