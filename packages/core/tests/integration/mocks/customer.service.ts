export interface Customer {
    id: string;
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
    externalIds: {
        hiboutik?: string;
        ringover?: string;
    };
    verificationStatus: 'verified' | 'pending' | 'failed';
    syncStatus: 'pending' | 'synced' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomerData {
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
}

export interface SearchCriteria {
    name?: string;
    email?: string;
    phone?: string;
}

export class CustomerService {
    private customers: Customer[] = [];
    private nextId = 1;

    async createCustomer(data: CustomerData): Promise<Customer> {
        const customer: Customer = {
            id: `cust-${this.nextId++}`,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            externalIds: {},
            verificationStatus: 'verified',
            syncStatus: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.customers.push(customer);
        return customer;
    }

    async updateExternalIds(customerId: string, externalIds: { hiboutik?: string; ringover?: string }): Promise<void> {
        const customer = this.customers.find(c => c.id === customerId);
        if (customer) {
            customer.externalIds = {
                ...customer.externalIds,
                ...externalIds
            };
            customer.syncStatus = 'synced';
            customer.updatedAt = new Date();
        }
    }

    clearTestData(): void {
        this.customers = [];
        this.nextId = 1;
    }
}