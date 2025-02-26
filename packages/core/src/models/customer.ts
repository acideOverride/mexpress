/**
 * Customer model and DTO definitions
 */

/**
 * Valid customer status values
 */
export enum CustomerStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    BLOCKED = 'BLOCKED'
}

/**
 * Address interface
 */
export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

/**
 * Customer interface representing a customer in the system
 */
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: Address;
    status: CustomerStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Data transfer object for creating a new customer
 */
export interface CreateCustomerDto {
    name: string;
    email: string;
    phone?: string;
    address?: Address;
    status: CustomerStatus;
    notes?: string;
}

/**
 * Data transfer object for updating an existing customer
 */
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
    status?: CustomerStatus;
    notes?: string;
}