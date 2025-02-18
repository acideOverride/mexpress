/**
 * Ringover service interface
 */
interface RingoverContact {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
}

export class RingoverService {
    private contacts: Map<string, RingoverContact> = new Map();

    /**
     * Create contact in Ringover
     */
    async createContact(data: RingoverContact): Promise<string> {
        // Simulated API call
        const contactId = `rov-${Date.now()}`;
        this.contacts.set(contactId, data);
        return contactId;
    }

    /**
     * Get contact from Ringover
     */
    async getContact(id: string): Promise<RingoverContact | undefined> {
        return this.contacts.get(id);
    }

    /**
     * Clear test data
     */
    clearTestData(): void {
        this.contacts.clear();
    }
}

// Export interface for use in tests
export type { RingoverContact };