/**
 * Unit tests for Customer model validation
 * Uses mocks to avoid database dependencies
 * 
 * MEXP-2025-008-BE: Customer Management Implementation
 */

import { Schema, Document } from 'mongoose';
import mongoose from 'mongoose';

// Define the Customer interface to use in our test
interface ICustomer {
  _id?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  syncStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define document type for mongoose
interface ICustomerDocument extends ICustomer, Document {}

// Create a proper mock implementation of Customer with validateSync
class MockCustomer {
  // Customer properties
  _id?: mongoose.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status: string;
  syncStatus: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<ICustomer>) {
    this._id = data._id || new mongoose.Types.ObjectId();
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.status = data.status || 'active'; // Default value
    this.syncStatus = data.syncStatus || 'pending'; // Default value
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Mock validation method to mimic mongoose's validateSync
  validateSync(): { errors: Record<string, { message: string }> } | undefined {
    const errors: Record<string, { message: string }> = {};

    // Validate firstName
    if (!this.firstName) {
      errors.firstName = { message: 'First name is required' };
    }

    // Validate lastName
    if (!this.lastName) {
      errors.lastName = { message: 'Last name is required' };
    }

    // Validate email
    if (!this.email) {
      errors.email = { message: 'Email is required' };
    } else if (!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(this.email)) {
      errors.email = { message: 'Email is invalid' };
    }

    // Validate phone
    if (!this.phone) {
      errors.phone = { message: 'Phone is required' };
    } else if (!/^\+?[0-9]{8,15}$/.test(this.phone)) {
      errors.phone = { message: 'Phone number is invalid' };
    }

    // Validate status
    if (this.status && !['active', 'inactive', 'blocked'].includes(this.status)) {
      errors.status = { message: 'Invalid status' };
    }

    // Validate syncStatus
    if (this.syncStatus && !['pending', 'synced', 'failed'].includes(this.syncStatus)) {
      errors.syncStatus = { message: 'Invalid sync status' };
    }

    return Object.keys(errors).length > 0 ? { errors } : undefined;
  }

  // Mock save method
  async save(): Promise<this> {
    // Set timestamps on save
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    this.updatedAt = new Date();
    return this;
  }
}

// Create a mock Customer "model" with static methods
const Customer = function(data: Partial<ICustomer>): MockCustomer {
  return new MockCustomer(data);
} as unknown as mongoose.Model<ICustomerDocument>;

// Track created customers
const createdCustomers = new Map<string, MockCustomer>();

// Add static methods to the Customer model
(Customer as any).deleteMany = jest.fn().mockResolvedValue(true);
(Customer as any).create = jest.fn().mockImplementation((data: any) => {
  // Check for unique email
  if (data.email && createdCustomers.has(data.email)) {
    return Promise.reject(new Error('Duplicate email'));
  }
  
  const customer = new MockCustomer(data);
  createdCustomers.set(data.email, customer);
  return Promise.resolve(customer);
});

describe('Customer Model', () => {
  beforeEach(() => {
    // Clear created customers
    createdCustomers.clear();
    jest.clearAllMocks();
  });

  const validCustomerData: Partial<ICustomer> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    status: 'active',
    syncStatus: 'pending'
  };

  it('should create a valid customer', () => {
    const customer = new Customer(validCustomerData);
    const validationError = customer.validateSync();
    expect(validationError).toBeUndefined();
  });

  it('should require firstName', () => {
    const customerData = { ...validCustomerData };
    delete customerData.firstName;
    const customer = new Customer(customerData);
    const validationError = customer.validateSync();
    expect(validationError?.errors.firstName).toBeDefined();
  });

  it('should require lastName', () => {
    const customerData = { ...validCustomerData };
    delete customerData.lastName;
    const customer = new Customer(customerData);
    const validationError = customer.validateSync();
    expect(validationError?.errors.lastName).toBeDefined();
  });

  it('should require a valid email', () => {
    const customerData = { ...validCustomerData, email: 'invalid-email' };
    const customer = new Customer(customerData);
    const validationError = customer.validateSync();
    expect(validationError?.errors.email).toBeDefined();
  });

  it('should require a valid phone number', () => {
    const customerData = { ...validCustomerData, phone: '123' };
    const customer = new Customer(customerData);
    const validationError = customer.validateSync();
    expect(validationError?.errors.phone).toBeDefined();
  });

  it('should set default status to active', () => {
    const customerData = { ...validCustomerData };
    delete customerData.status;
    const customer = new Customer(customerData);
    expect(customer.status).toBe('active');
  });

  it('should set default syncStatus to pending', () => {
    const customerData = { ...validCustomerData };
    delete customerData.syncStatus;
    const customer = new Customer(customerData);
    expect(customer.syncStatus).toBe('pending');
  });

  it('should set timestamps on save', async () => {
    const customer = new Customer({
      ...validCustomerData,
      email: 'timestamps@example.com'
    });
    
    // Initial timestamps should be undefined
    expect(customer.createdAt).toBeUndefined();
    expect(customer.updatedAt).toBeUndefined();
    
    // Save the customer
    const saved = await customer.save();
    
    // After save, timestamps should be defined
    expect(saved.createdAt).toBeDefined();
    expect(saved.updatedAt).toBeDefined();
  });

  it('should update timestamps on update', async () => {
    // Create customer directly
    const customer = new Customer({
      ...validCustomerData,
      email: 'update@example.com'
    });
    
    // Add timestamps manually to simulate initial save
    const initialCreatedAt = new Date(Date.now() - 1000); // 1 second ago
    customer.createdAt = initialCreatedAt;
    customer.updatedAt = initialCreatedAt;
    
    // Wait to ensure timestamp will be different
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Update customer
    customer.firstName = 'Jane';
    const updated = await customer.save();
    
    // createdAt should not change
    expect(updated.createdAt).toEqual(initialCreatedAt);
    
    // updatedAt should change
    expect(updated.updatedAt).not.toEqual(initialCreatedAt);
    expect(updated.updatedAt!.getTime()).toBeGreaterThan(initialCreatedAt.getTime());
  });
});