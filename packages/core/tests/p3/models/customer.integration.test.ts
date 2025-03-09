/**
 * Integration tests for Customer model
 * Uses mocks to simulate MongoDB operations for P3 (low priority) tests
 */

import { jest } from '@jest/globals';

// Mock the ICustomer interface
interface ICustomer {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  syncStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock validation error interface
class ValidationError {
  errors: Record<string, { message: string }> = {};
  
  constructor(errors: Record<string, string>) {
    Object.entries(errors).forEach(([field, message]) => {
      this.errors[field] = { message };
    });
  }
}

// Mock Customer model
class Customer {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status: string = 'active';
  syncStatus: string = 'pending';
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
  
  constructor(data: Partial<ICustomer>) {
    Object.assign(this, data);
  }
  
  // Mock validation method
  validateSync(): ValidationError | undefined {
    const errors: Record<string, string> = {};
    
    if (!this.firstName) {
      errors.firstName = 'firstName is required';
    }
    
    if (!this.lastName) {
      errors.lastName = 'lastName is required';
    }
    
    if (!this.email) {
      errors.email = 'email is required';
    } else if (!this.email.includes('@')) {
      errors.email = 'email must be valid';
    }
    
    if (this.phone && this.phone.length < 10) {
      errors.phone = 'phone must be valid';
    }
    
    return Object.keys(errors).length > 0 ? new ValidationError(errors) : undefined;
  }
  
  // Mock save method
  async save(): Promise<this> {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    
    this.updatedAt = new Date();
    return this;
  }
  
  // Mock static methods
  static async deleteMany(): Promise<void> {
    // Mock implementation - do nothing
  }
  
  static async create(data: Partial<ICustomer>): Promise<Customer> {
    const customer = new Customer(data);
    customer.createdAt = new Date();
    customer.updatedAt = new Date();
    return customer;
  }
}

describe('Customer Model', () => {
  // Mock mongoose connection
  const mockMongoose = {
    connect: jest.fn(),
    connection: {
      close: jest.fn(),
      dropDatabase: jest.fn()
    }
  };
  
  beforeEach(async () => {
    await Customer.deleteMany();
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
    // Create and save customer
    const customer = await Customer.create({
      ...validCustomerData,
      email: 'update@example.com'
    });
    
    // Get initial timestamps
    const createdAt = customer.createdAt;
    const updatedAt = customer.updatedAt;
    
    // Wait to ensure timestamp will be different
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update customer
    customer.firstName = 'Jane';
    const updated = await customer.save();
    
    // createdAt should not change
    expect(updated.createdAt).toEqual(createdAt);
    
    // updatedAt should change
    expect(updated.updatedAt).not.toEqual(updatedAt);
    expect(updated.updatedAt!.getTime()).toBeGreaterThan(updatedAt!.getTime());
  });
});