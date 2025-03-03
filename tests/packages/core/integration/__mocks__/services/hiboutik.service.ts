export class HiboutikService {
    async createCustomer(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address?: {
            street: string;
            city: string;
            country: string;
            postalCode: string;
        };
    }): Promise<string> {
        // Mock implementation returns a fake Hiboutik ID
        return `hiboutik-${Math.floor(Math.random() * 10000)}`;
    }
}