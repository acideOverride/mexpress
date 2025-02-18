import { CustomerService } from '../customer.service';
import { Customer, ICustomer } from '../../models/customer';
import mongoose from 'mongoose';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let db: mongoose.Connection;

  const validCustomerData: Partial<ICustomer> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    status: 'active',
    syncStatus: 'pending'
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress_test');
    db = mongoose.connection;
    customerService = new CustomerService();
  });

  afterAll(async () => {
    await db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Customer.deleteMany({});
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
      const found = await Customer.findById(created._id).lean();
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
      const updated = await Customer.findByIdAndUpdate(
        created._id,
        { $set: updateData },
        { new: true }
      );
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