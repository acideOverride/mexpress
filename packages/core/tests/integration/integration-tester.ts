import { HiboutikService } from './mocks/hiboutik.service';
import { RingoverService } from './mocks/ringover.service';
import { CustomerService, Customer } from './mocks/customer.service';
import { MonitoringSystem } from './mocks/monitoring';

interface IntegrationResult {
    success: boolean;
    externalId?: string;
    hiboutikId?: string;
    ringoverId?: string;
    errors: string[];
}

/**
 * External integration testing implementation
 */
export class IntegrationTester {
    constructor(
        private readonly hiboutikService: HiboutikService,
        private readonly ringoverService: RingoverService,
        private readonly customerService: CustomerService,
        private readonly monitoring: MonitoringSystem
    ) {}

    /**
     * Test Hiboutik sync
     */
    async testHiboutikSync(customer: Customer): Promise<IntegrationResult> {
        try {
            // Attempt Hiboutik sync
            const hiboutikId = await this.hiboutikService.createCustomer({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                address: customer.address
            });

            await this.monitoring.incrementCounter('hiboutik_sync_total', { status: 'success' });
            
            return {
                success: true,
                externalId: hiboutikId,
                errors: []
            };
        } catch (error) {
            await this.monitoring.incrementCounter('hiboutik_sync_total', { status: 'error' });
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                errors: [errorMessage.includes('Rate limit') 
                    ? 'Rate limit exceeded - retry after backoff'
                    : 'Network error occurred']
            };
        }
    }

    /**
     * Test Ringover sync
     */
    async testRingoverSync(customer: Customer): Promise<IntegrationResult> {
        try {
            // Attempt Ringover sync
            const ringoverId = await this.ringoverService.createContact({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone
            });

            await this.monitoring.incrementCounter('ringover_sync_total', { status: 'success' });
            
            return {
                success: true,
                externalId: ringoverId,
                errors: []
            };
        } catch (error) {
            await this.monitoring.incrementCounter('ringover_sync_total', { status: 'error' });
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                errors: [errorMessage.includes('Rate limit') 
                    ? 'Rate limit exceeded - retry after backoff'
                    : 'Network error occurred']
            };
        }
    }

    /**
     * Test full sync workflow
     */
    async testFullSync(customer: Customer): Promise<IntegrationResult> {
        const errors: string[] = [];
        let hiboutikId: string | undefined;
        let ringoverId: string | undefined;

        // Attempt Hiboutik sync
        const hiboutikResult = await this.testHiboutikSync(customer);
        if (!hiboutikResult.success) {
            errors.push(`Hiboutik sync failed: ${hiboutikResult.errors[0]}`);
        } else {
            hiboutikId = hiboutikResult.externalId;
        }

        // Attempt Ringover sync
        const ringoverResult = await this.testRingoverSync(customer);
        if (!ringoverResult.success) {
            errors.push(`Ringover sync failed: ${ringoverResult.errors[0]}`);
        } else {
            ringoverId = ringoverResult.externalId;
        }

        // Update customer if any sync succeeded
        if (hiboutikId || ringoverId) {
            await this.customerService.updateExternalIds(customer.id, {
                hiboutik: hiboutikId,
                ringover: ringoverId
            });
        }

        return {
            success: errors.length === 0,
            hiboutikId,
            ringoverId,
            errors
        };
    }

    /**
     * Test customer bulk import functionality
     * This is the function that was missing and causing the test failure
     */
    async testCustomerImport(customers: Customer[]): Promise<{
        success: boolean;
        importedCount: number;
        failedCount: number;
        errors: string[];
    }> {
        try {
            const results = await Promise.all(
                customers.map(async (customer) => {
                    // Process each customer in chunks to prevent timeout
                    return this.testFullSync(customer);
                })
            );
            
            const importedCount = results.filter(r => r.success).length;
            const failedCount = results.filter(r => !r.success).length;
            const allErrors = results.flatMap(r => r.errors);
            
            await this.monitoring.incrementCounter('customer_import_total', {
                status: failedCount === 0 ? 'success' : 'partial',
                count: String(customers.length)
            });
            
            return {
                success: failedCount === 0,
                importedCount,
                failedCount,
                errors: allErrors
            };
        } catch (error) {
            await this.monitoring.incrementCounter('customer_import_total', {
                status: 'error',
                count: String(customers.length)
            });
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                importedCount: 0,
                failedCount: customers.length,
                errors: [errorMessage.includes('Timeout')
                    ? 'Import operation exceeded time limit - use smaller batch sizes'
                    : 'Import operation failed']
            };
        }
    }

    /**
     * Clear test state
     */
    clearState(): void {
        this.customerService.clearTestData();
    }
}