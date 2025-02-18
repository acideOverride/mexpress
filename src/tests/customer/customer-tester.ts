import { CustomerService, CustomerData, SearchCriteria, Customer } from '../../services/customer.service';
import { MonitoringSystem } from '../../lib/monitoring/monitoring';

interface CustomerResult {
    success: boolean;
    customer?: Customer;
    customers?: Customer[];
    message?: string;
    errors: string[];
}

/**
 * Customer testing implementation
 */
export class CustomerTester {
    constructor(
        private readonly customerService: CustomerService,
        private readonly monitoring: MonitoringSystem
    ) {}

    /**
     * Test customer creation
     */
    async testCreateCustomer(data: Partial<CustomerData>): Promise<CustomerResult> {
        try {
            // Validate required fields
            const missingFields = this.validateRequiredFields(data);
            if (missingFields.length > 0) {
                await this.monitoring.incrementCounter('customer_creation_total', { status: 'invalid_fields' });
                return {
                    success: false,
                    errors: [`Missing required fields: ${missingFields.join(', ')}`]
                };
            }

            // Validate email format
            if (data.email && !this.validateEmailFormat(data.email)) {
                await this.monitoring.incrementCounter('customer_creation_total', { status: 'invalid_email' });
                return {
                    success: false,
                    errors: ['Invalid email format']
                };
            }

            // Validate phone format if provided
            if (data.phone && !this.validatePhoneFormat(data.phone)) {
                await this.monitoring.incrementCounter('customer_creation_total', { status: 'invalid_phone' });
                return {
                    success: false,
                    errors: ['Invalid phone number format']
                };
            }

            // Validate postal code if address provided
            if (data.address?.postalCode && !this.validatePostalCode(data.address.postalCode)) {
                await this.monitoring.incrementCounter('customer_creation_total', { status: 'invalid_postal' });
                return {
                    success: false,
                    errors: ['Invalid postal code format']
                };
            }

            // Create customer
            const customer = await this.customerService.createCustomer(data as CustomerData);
            await this.monitoring.incrementCounter('customer_creation_total', { status: 'success' });
            
            return {
                success: true,
                customer,
                errors: []
            };
        } catch (error) {
            await this.monitoring.incrementCounter('customer_creation_total', { status: 'error' });
            return {
                success: false,
                errors: ['Network error occurred']
            };
        }
    }

    /**
     * Test customer search
     */
    async testSearchCustomer(criteria: SearchCriteria): Promise<CustomerResult> {
        try {
            // Validate search criteria
            if (!this.validateSearchCriteria(criteria)) {
                await this.monitoring.incrementCounter('customer_search_total', { status: 'invalid_criteria' });
                return {
                    success: false,
                    errors: ['Invalid search criteria']
                };
            }

            // Search customers
            const customers = await this.customerService.searchCustomers(criteria);
            await this.monitoring.incrementCounter('customer_search_total', { status: 'success' });

            return {
                success: true,
                customers,
                message: customers.length === 0 ? 'No customers found' : undefined,
                errors: []
            };
        } catch (error) {
            await this.monitoring.incrementCounter('customer_search_total', { status: 'error' });
            return {
                success: false,
                errors: ['Network error occurred']
            };
        }
    }

    /**
     * Validate required fields
     */
    private validateRequiredFields(data: Partial<CustomerData>): string[] {
        const requiredFields = ['firstName', 'email'];
        const missingFields = requiredFields.filter(field => !data[field as keyof CustomerData]);
        return missingFields;
    }

    /**
     * Validate email format
     */
    private validateEmailFormat(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone number format
     */
    private validatePhoneFormat(phone: string): boolean {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Validate postal code format
     */
    private validatePostalCode(postalCode: string): boolean {
        const postalRegex = /^[A-Z0-9]{3,10}$/i;
        return postalRegex.test(postalCode);
    }

    /**
     * Validate search criteria
     */
    private validateSearchCriteria(criteria: SearchCriteria): boolean {
        return !!(criteria.email || criteria.name || criteria.phone);
    }

    /**
     * Clear test state
     */
    clearState(): void {
        this.customerService.clearTestData();
    }
}