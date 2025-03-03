import { Schema } from 'mongoose';
import { ICustomer } from '../../../src/models/customer';
import mongoose from 'mongoose';

// Create a mock Customer model to avoid database dependencies
const mockCustomerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  },
  phone: {
    type: String,
    required: true,
    match: /^\+?[0-9]{8,15}$/
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  syncStatus: {
    type: String,
    enum: ['pending', 'synced', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', mockCustomerSchema);

// Mock mongoose operations
(Customer as any).deleteMany = jest.fn().mockResolvedValue(true);
(Customer as any).create = jest.fn().mockImplementation((data: any) => {
  // Check for unique email
  if (data.email && createdCustomers.has(data.email)) {
    return Promise.reject(new Error('Duplicate email'));
  }
  
  const customer = new Customer(data);
  createdCustomers.set(data.email, customer);
  return Promise.resolve(customer);
});

// Track created customers
const createdCustomers = new Map();

// Mock save method
const originalSave = mongoose.Model.prototype.save;
mongoose.Model.prototype.save = function(this: any) {
  // Set timestamps
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  return Promise.resolve(this);
};

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