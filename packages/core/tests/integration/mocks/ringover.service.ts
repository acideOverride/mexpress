export class RingoverService {
    async createContact(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    }): Promise<string> {
        // Mock implementation returns a fake Ringover ID
        return `ringover-${Math.floor(Math.random() * 10000)}`;
    }
}