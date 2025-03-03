/**
 * Integration tests for Customer model
 * Uses real MongoDB connection to test database operations
 */

import { Schema } from 'mongoose';
import { Customer, ICustomer } from '../customer';
import mongoose from 'mongoose';

describe('Customer Model', () => {
  let db: mongoose.Connection;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress_test');
    db = mongoose.connection;
  });

  afterAll(async () => {
    await db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Customer.deleteMany({});
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