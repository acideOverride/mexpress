import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Customer, ICustomerDocument } from '../customer';

describe('Customer Model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }, 30000); // Increase timeout to 30 seconds

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Customer.deleteMany({});
  });

  const validCustomerData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    externalIds: {},
    verificationStatus: 'pending' as const,
    syncStatus: {
      hiboutik: 'pending' as const,
      ringover: 'pending' as const,
    },
  };

  it('should create a valid customer', async () => {
    const customer = new Customer(validCustomerData);
    const savedCustomer = await customer.save();

    expect(savedCustomer._id).toBeDefined();
    expect(savedCustomer.firstName).toBe(validCustomerData.firstName);
    expect(savedCustomer.lastName).toBe(validCustomerData.lastName);
    expect(savedCustomer.email).toBe(validCustomerData.email);
    expect(savedCustomer.phone).toBe(validCustomerData.phone);
    expect(savedCustomer.verificationStatus).toBe(validCustomerData.verificationStatus);
    expect(savedCustomer.syncStatus.hiboutik).toBe(validCustomerData.syncStatus.hiboutik);
    expect(savedCustomer.syncStatus.ringover).toBe(validCustomerData.syncStatus.ringover);
    expect(savedCustomer.createdAt).toBeDefined();
    expect(savedCustomer.updatedAt).toBeDefined();
  });

  it('should require firstName', async () => {
    const { firstName, ...customerWithoutFirstName } = validCustomerData;
    const customer = new Customer(customerWithoutFirstName);
    await expect(customer.save()).rejects.toThrow();
  });

  it('should require lastName', async () => {
    const { lastName, ...customerWithoutLastName } = validCustomerData;
    const customer = new Customer(customerWithoutLastName);
    await expect(customer.save()).rejects.toThrow();
  });

  it('should require valid email', async () => {
    const customerWithInvalidEmail = new Customer({
      ...validCustomerData,
      email: 'invalid-email',
    });
    await expect(customerWithInvalidEmail.save()).rejects.toThrow();
  });

  it('should require valid phone number', async () => {
    const customerWithInvalidPhone = new Customer({
      ...validCustomerData,
      phone: 'invalid-phone',
    });
    await expect(customerWithInvalidPhone.save()).rejects.toThrow();
  });

  it('should enforce unique email addresses', async () => {
    await new Customer(validCustomerData).save();
    const duplicateCustomer = new Customer(validCustomerData);
    await expect(duplicateCustomer.save()).rejects.toThrow();
  });

  it('should allow optional external IDs', async () => {
    const customerWithExternalIds = new Customer({
      ...validCustomerData,
      externalIds: {
        hiboutik: 'HIB123',
        ringover: 'RING456',
      },
    });

    const savedCustomer = await customerWithExternalIds.save();
    expect(savedCustomer.externalIds.hiboutik).toBe('HIB123');
    expect(savedCustomer.externalIds.ringover).toBe('RING456');
  });

  it('should default verificationStatus to pending', async () => {
    const { verificationStatus, ...customerWithoutStatus } = validCustomerData;
    const customer = new Customer(customerWithoutStatus);
    const savedCustomer = await customer.save();
    expect(savedCustomer.verificationStatus).toBe('pending');
  });

  it('should default syncStatus to pending', async () => {
    const { syncStatus, ...customerWithoutSync } = validCustomerData;
    const customer = new Customer(customerWithoutSync);
    const savedCustomer = await customer.save();
    expect(savedCustomer.syncStatus.hiboutik).toBe('pending');
    expect(savedCustomer.syncStatus.ringover).toBe('pending');
  });

  it('should update timestamps on modification', async () => {
    const customer = await new Customer(validCustomerData).save();
    const originalUpdatedAt = customer.updatedAt;
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms

    customer.firstName = 'Jane';
    const updatedCustomer = await customer.save();
    expect(updatedCustomer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});