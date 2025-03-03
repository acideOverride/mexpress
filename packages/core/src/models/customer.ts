/**
 * Customer model and DTO definitions
 */
import mongoose, { Document, Schema, Model } from 'mongoose';

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
    firstName: string;
    lastName: string;
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
    firstName: string;
    lastName: string;
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
    firstName?: string;
    lastName?: string;
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

/**
 * Customer schema for MongoDB
 */
const customerSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    status: { 
        type: String, 
        enum: Object.values(CustomerStatus),
        default: CustomerStatus.ACTIVE
    },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Define static methods for mock implementation
export const CustomerModel = {
    findOne: jest.fn()
} as unknown as Model<Customer & Document>;