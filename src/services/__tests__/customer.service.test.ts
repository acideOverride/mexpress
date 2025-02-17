import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CustomerService } from '../customer.service';
import { Customer, ICustomer, ICustomerDocument } from '../../models/customer';
import { RateLimiter } from '../../utils/rate-limiter';

// Mock rate limiter
jest.mock('../../utils/rate-limiter');

describe('CustomerService', () => {
  let mongoServer: MongoMemoryServer;
  let customerService: CustomerService;
  const MockedRateLimiter = RateLimiter as jest.MockedClass<typeof RateLimiter>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    MockedRateLimiter.prototype.checkLimit.mockResolvedValue({
      remaining: 99,
      resetTime: Date.now() + 60000,
    });
    customerService = new CustomerService();
  });

  afterEach(async () => {
    await Customer.deleteMany({});
  });

  const validCustomerData: Omit<ICustomer, 'createdAt' | 'updatedAt'> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    externalIds: {},
    verificationStatus: 'pending',
    syncStatus: {
      hiboutik: 'pending',
      ringover: 'pending',
    },
  };

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const customer = await customerService.createCustomer(validCustomerData);

      expect(customer).toBeDefined();
      expect(customer.firstName).toBe(validCustomerData.firstName);
      expect(customer.lastName).toBe(validCustomerData.lastName);
      expect(customer.email).toBe(validCustomerData.email);
      expect(customer.phone).toBe(validCustomerData.phone);
      expect(customer.verificationStatus).toBe('pending');
      expect(customer.syncStatus.hiboutik).toBe('pending');
      expect(customer.syncStatus.ringover).toBe('pending');
    });

    it('should check rate limit before creating customer', async () => {
      await customerService.createCustomer(validCustomerData);
      expect(MockedRateLimiter.prototype.checkLimit).toHaveBeenCalledWith('createCustomer');
    });

    it('should throw error when rate limit exceeded', async () => {
      MockedRateLimiter.prototype.checkLimit.mockRejectedValue(new Error('Rate limit exceeded'));
      await expect(customerService.createCustomer(validCustomerData)).rejects.toThrow('Rate limit exceeded');
    });

    it('should throw error for duplicate email', async () => {
      await customerService.createCustomer(validCustomerData);
      await expect(customerService.createCustomer(validCustomerData)).rejects.toThrow();
    });
  });

  describe('getCustomerById', () => {
    it('should retrieve customer by ID', async () => {
      const created = (await customerService.createCustomer(validCustomerData)) as ICustomerDocument;

      const found = await customerService.getCustomerById(created._id.toString());
      expect(found).toBeDefined();
      expect(found?.email).toBe('john.doe@example.com');
    });

    it('should return null for non-existent ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await customerService.getCustomerById(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe('updateCustomer', () => {
    it('should update customer successfully', async () => {
      const created = (await customerService.createCustomer(validCustomerData)) as ICustomerDocument;

      const updated = await customerService.updateCustomer(created._id.toString(), {
        firstName: 'Jane',
        lastName: 'Smith',
      });

      expect(updated).toBeDefined();
      expect(updated?.firstName).toBe('Jane');
      expect(updated?.lastName).toBe('Smith');
      expect(updated?.email).toBe('john.doe@example.com');
    });

    it('should check rate limit before updating', async () => {
      const created = (await customerService.createCustomer(validCustomerData)) as ICustomerDocument;

      await customerService.updateCustomer(created._id.toString(), { firstName: 'Jane' });
      expect(MockedRateLimiter.prototype.checkLimit).toHaveBeenCalledWith('updateCustomer');
    });
  });

  describe('deleteCustomer', () => {
    it('should delete customer successfully', async () => {
      const created = (await customerService.createCustomer(validCustomerData)) as ICustomerDocument;

      const result = await customerService.deleteCustomer(created._id.toString());
      expect(result).toBe(true);

      const found = await customerService.getCustomerById(created._id.toString());
      expect(found).toBeNull();
    });

    it('should return false for non-existent ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await customerService.deleteCustomer(nonExistentId);
      expect(result).toBe(false);
    });
  });

  describe('searchCustomers', () => {
    beforeEach(async () => {
      await customerService.createCustomer({
        ...validCustomerData,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });
      await customerService.createCustomer({
        ...validCustomerData,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
      });
    });

    it('should search customers by firstName', async () => {
      const results = await customerService.searchCustomers({ firstName: 'John' });
      expect(results).toHaveLength(1);
      expect(results[0].email).toBe('john.doe@example.com');
    });

    it('should search customers by email pattern', async () => {
      const results = await customerService.searchCustomers({ email: 'jane' });
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Jane');
    });

    it('should return empty array for no matches', async () => {
      const results = await customerService.searchCustomers({ firstName: 'NonExistent' });
      expect(results).toHaveLength(0);
    });
  });

  describe('verifyCustomer', () => {
    it('should update verification status to verified', async () => {
      const created = (await customerService.createCustomer(validCustomerData)) as ICustomerDocument;

      const verified = await customerService.verifyCustomer(created._id.toString());
      expect(verified).toBeDefined();
      expect(verified?.verificationStatus).toBe('verified');
    });
  });

  describe('updateSyncStatus', () => {
    it('should update sync status for specified system', async () => {
      const created = (await customerService.createCustomer(validCustomerData)) as ICustomerDocument;

      const updated = await customerService.updateSyncStatus(
        created._id.toString(),
        'hiboutik',
        'synced'
      );

      expect(updated).toBeDefined();
      expect(updated?.syncStatus.hiboutik).toBe('synced');
      expect(updated?.syncStatus.ringover).toBe('pending');
    });
  });
});