export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCustomerDto {
    name: string;
    email: string;
    phone?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
}

export interface UpdateCustomerDto {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
    };
}