// Import from test mocks only to avoid real database interactions
// MEXP-2025-008-BE Customer Management P0 Tests
import { CustomerService, Customer, ICustomer } from '../customer.service';
import mongoose from 'mongoose';

// Override the default timeout for all tests in this file
jest.setTimeout(60000); // 60 seconds

// Completely mock mongoose to avoid any actual database interactions
jest.mock('mongoose', () => {
  const mong = jest.requireActual('mongoose');
  return {
    ...mong,
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      on: jest.fn(),
      once: jest.fn(),
      collections: {} // Add empty collections object to prevent errors
    }
  };
});

describe('CustomerService', () => {
  let customerService: CustomerService;

  const validCustomerData: Partial<ICustomer> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    status: 'active',
    syncStatus: 'pending'
  };

  beforeAll(() => {
    // Create the service instance - no async needed with mocks
    customerService = new CustomerService();
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Reset the in-memory customers collection
    if (Customer.deleteMany) {
      Customer.deleteMany();
    }
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const customer = await customerService.create(validCustomerData);
      expect(customer).toBeDefined();
      expect(customer.firstName).toBe(validCustomerData.firstName);
      expect(customer.lastName).toBe(validCustomerData.lastName);
      expect(customer.email).toBe(validCustomerData.email);
      expect(customer.phone).toBe(validCustomerData.phone);
      expect(customer.status).toBe(validCustomerData.status);
      expect(customer.syncStatus).toBe(validCustomerData.syncStatus);
    });

    it('should throw error for duplicate email', async () => {
      await customerService.create(validCustomerData);
      await expect(customerService.create(validCustomerData)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should find customer by id', async () => {
      const created = await customerService.create({
        ...validCustomerData,
        email: 'find@example.com'
      });
      const found = await customerService.findById(created._id.toString());
      expect(found).toBeDefined();
      expect(found?.email).toBe('find@example.com');
    });

    it('should return null for non-existent customer', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await customerService.findById(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all customers', async () => {
      await customerService.create(validCustomerData);
      await customerService.create({
        ...validCustomerData,
        email: 'jane.doe@example.com',
        phone: '+1987654321'
      });

      const customers = await customerService.findAll();
      expect(customers).toHaveLength(2);
    });

    it('should return empty array when no customers exist', async () => {
      const customers = await customerService.findAll();
      expect(customers).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update customer', async () => {
      const created = await customerService.create({
        ...validCustomerData,
        email: 'update@example.com'
      });
      const updateData = { firstName: 'Jane', lastName: 'Smith' };
      const updated = await customerService.update(created._id.toString(), updateData);
      expect(updated).toBeDefined();
      expect(updated?.firstName).toBe(updateData.firstName);
      expect(updated?.lastName).toBe(updateData.lastName);
    });

    it('should return null for non-existent customer', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await customerService.update(nonExistentId, { firstName: 'Jane' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete customer', async () => {
      const created = await customerService.create({
        ...validCustomerData,
        email: 'delete@example.com'
      });
      const result = await customerService.delete(created._id.toString());
      expect(result).toBe(true);
      const found = await customerService.findById(created._id.toString());
      expect(found).toBeNull();
    });

    it('should return false for non-existent customer', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await customerService.delete(nonExistentId);
      expect(result).toBe(false);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await customerService.create(validCustomerData);
      await customerService.create({
        ...validCustomerData,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321'
      });
    });

    it('should search customers by name', async () => {
      const results = await customerService.search({ query: 'John' });
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('John');
    });

    it('should search customers by email', async () => {
      const results = await customerService.search({ query: 'jane.smith' });
      expect(results).toHaveLength(1);
      expect(results[0].email).toBe('jane.smith@example.com');
    });

    it('should return empty array for no matches', async () => {
      const results = await customerService.search({ query: 'NonExistent' });
      expect(results).toHaveLength(0);
    });
  });
});