/**
 * Hiboutik service interface
 */
interface HiboutikCustomer {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        country: string;
        postalCode: string;
    };
}

export class HiboutikService {
    private customers: Map<string, HiboutikCustomer> = new Map();

    /**
     * Create customer in Hiboutik
     */
    async createCustomer(data: HiboutikCustomer): Promise<string> {
        // Simulated API call
        const customerId = `hbt-${Date.now()}`;
        this.customers.set(customerId, data);
        return customerId;
    }

    /**
     * Get customer from Hiboutik
     */
    async getCustomer(id: string): Promise<HiboutikCustomer | undefined> {
        return this.customers.get(id);
    }

    /**
     * Clear test data
     */
    clearTestData(): void {
        this.customers.clear();
    }
}

// Export interface for use in tests
export type { HiboutikCustomer };