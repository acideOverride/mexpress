/**
 * Customer model tests
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Customer from '../../../src/backend/models/customer.model';
import User from '../../../src/backend/models/user.model';
import { UserRole } from '../../../src/shared/types/models';

let mongoServer: MongoMemoryServer;

// Sample user data for testing
const sampleUserId = new mongoose.Types.ObjectId();
const validCustomerData = {
  userId: sampleUserId,
  phone: '+1 (555) 123-4567',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'State',
    postalCode: '12345',
    country: 'Country'
  },
  dateOfBirth: new Date('1990-01-01'),
  emergencyContact: {
    name: 'Emergency Contact',
    phone: '+1 (555) 987-6543',
    relationship: 'family'
  },
  preferences: {
    bikeTypes: ['mountain', 'hybrid'],
    bikeSize: 'm',
    notificationPreferences: {
      email: true,
      sms: true,
      push: false
    }
  },
  paymentMethods: [
    {
      type: 'credit',
      lastFour: '4242',
      expiryDate: '12/30',
      cardholderName: 'Card Holder',
      isDefault: true
    }
  ],
  loyaltyPoints: 100,
  verificationStatus: 'verified'
};

// Connect to in-memory MongoDB before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  
  // Create a sample user for customer tests
  const user = new User({
    _id: sampleUserId,
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.CUSTOMER,
    isActive: true
  });
  await user.save();
});

// Clear test data after each test
afterEach(async () => {
  await Customer.deleteMany({});
});

// Disconnect and close MongoDB server after all tests
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Customer Model', () => {
  // Basic customer creation test
  test('should create a customer with valid data', async () => {
    const customer = new Customer(validCustomerData);
    const savedCustomer = await customer.save();
    
    expect(savedCustomer._id).toBeDefined();
    expect(savedCustomer.userId.toString()).toBe(sampleUserId.toString());
    expect(savedCustomer.phone).toBe(validCustomerData.phone);
    expect(savedCustomer.loyaltyPoints).toBe(100);
  });

  // Validation tests
  test('should require mandatory fields', async () => {
    const customerMissingRequiredFields = new Customer({
      // Missing userId and phone
      loyaltyPoints: 50
    });
    
    await expect(customerMissingRequiredFields.save()).rejects.toThrow();
  });
  
  test('should validate phone format', async () => {
    const customerInvalidPhone = new Customer({
      ...validCustomerData,
      phone: 'invalid-phone'
    });
    
    await expect(customerInvalidPhone.save()).rejects.toThrow();
  });
  
  test('should validate date of birth is not in the future', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    const customerWithFutureBirthDate = new Customer({
      ...validCustomerData,
      dateOfBirth: futureDate
    });
    
    await expect(customerWithFutureBirthDate.save()).rejects.toThrow();
  });
  
  test('should validate payment method expiry date format', async () => {
    const customerInvalidExpiryDate = new Customer({
      ...validCustomerData,
      paymentMethods: [
        {
          type: 'credit',
          lastFour: '4242',
          expiryDate: '12-30', // Invalid format
          cardholderName: 'Card Holder',
          isDefault: true
        }
      ]
    });
    
    await expect(customerInvalidExpiryDate.save()).rejects.toThrow();
  });

  // Method and virtual tests
  test('should add loyalty points', async () => {
    const customer = new Customer(validCustomerData);
    await customer.save();
    
    const initialPoints = customer.loyaltyPoints;
    customer.addLoyaltyPoints(50);
    await customer.save();
    
    const updatedCustomer = await Customer.findById(customer._id);
    expect(updatedCustomer?.loyaltyPoints).toBe(initialPoints + 50);
  });
  
  test('should deduct loyalty points if customer has enough', async () => {
    const customer = new Customer({
      ...validCustomerData,
      loyaltyPoints: 100
    });
    await customer.save();
    
    const success = customer.deductLoyaltyPoints(50);
    expect(success).toBe(true);
    await customer.save();
    
    const updatedCustomer = await Customer.findById(customer._id);
    expect(updatedCustomer?.loyaltyPoints).toBe(50);
  });
  
  test('should not deduct loyalty points if customer does not have enough', async () => {
    const customer = new Customer({
      ...validCustomerData,
      loyaltyPoints: 30
    });
    await customer.save();
    
    const success = customer.deductLoyaltyPoints(50);
    expect(success).toBe(false);
    
    const updatedCustomer = await Customer.findById(customer._id);
    expect(updatedCustomer?.loyaltyPoints).toBe(30);
  });
  
  test('should manage payment methods correctly', async () => {
    const customer = new Customer(validCustomerData);
    await customer.save();
    
    // Initial state
    expect(customer.paymentMethods.length).toBe(1);
    expect(customer.hasDefaultPaymentMethod()).toBe(true);
    
    // Add new payment method (not default)
    customer.addPaymentMethod({
      type: 'debit',
      lastFour: '1234',
      expiryDate: '10/30',
      cardholderName: 'Another Card'
    });
    
    await customer.save();
    
    // Check updated state
    const updatedCustomer = await Customer.findById(customer._id);
    expect(updatedCustomer?.paymentMethods.length).toBe(2);
    
    // Remove first payment method
    const methodId = updatedCustomer?.paymentMethods[0]._id.toString();
    if (methodId) {
      const removed = updatedCustomer?.removePaymentMethod(methodId);
      expect(removed).toBe(true);
      await updatedCustomer?.save();
      
      // Check that second method is now default
      const reloadedCustomer = await Customer.findById(customer._id);
      expect(reloadedCustomer?.paymentMethods.length).toBe(1);
      expect(reloadedCustomer?.paymentMethods[0].isDefault).toBe(true);
    }
  });
  
  test('should determine rental eligibility', async () => {
    const customer = new Customer(validCustomerData);
    await customer.save();
    
    const eligibility = customer.isEligibleForRental();
    expect(eligibility.eligible).toBe(true);
    
    // Test ineligibility cases
    const unverifiedCustomer = new Customer({
      ...validCustomerData,
      verificationStatus: 'unverified'
    });
    const unverifiedEligibility = unverifiedCustomer.isEligibleForRental();
    expect(unverifiedEligibility.eligible).toBe(false);
    expect(unverifiedEligibility.reason).toContain('identity not verified');
  });

  // Static method tests
  test('should find customers by bike preferences', async () => {
    // Create multiple customers with different preferences
    const mountainCustomer = new Customer(validCustomerData);
    
    const roadCustomer = new Customer({
      ...validCustomerData,
      userId: new mongoose.Types.ObjectId(),
      phone: '+1 (555) 111-2222',
      preferences: {
        bikeTypes: ['road'],
        bikeSize: 'l'
      }
    });
    
    const electricCustomer = new Customer({
      ...validCustomerData,
      userId: new mongoose.Types.ObjectId(),
      phone: '+1 (555) 333-4444',
      preferences: {
        bikeTypes: ['electric', 'city'],
        bikeSize: 'm'
      }
    });
    
    await Promise.all([
      mountainCustomer.save(),
      roadCustomer.save(),
      electricCustomer.save()
    ]);
    
    // Find by bike type
    const mountainBikeCustomers = await Customer.findByBikePreferences('mountain');
    expect(mountainBikeCustomers.length).toBe(1);
    
    // Find by bike type and size
    const mediumBikeCustomers = await Customer.findByBikePreferences('electric', 'm');
    expect(mediumBikeCustomers.length).toBe(1);
  });
  
  test('should find customers by loyalty points range', async () => {
    // Create customers with different loyalty points
    const lowPointsCustomer = new Customer({
      ...validCustomerData,
      userId: new mongoose.Types.ObjectId(),
      phone: '+1 (555) 111-2222',
      loyaltyPoints: 50
    });
    
    const mediumPointsCustomer = new Customer({
      ...validCustomerData,
      userId: new mongoose.Types.ObjectId(),
      phone: '+1 (555) 333-4444',
      loyaltyPoints: 250
    });
    
    const highPointsCustomer = new Customer({
      ...validCustomerData,
      userId: new mongoose.Types.ObjectId(),
      phone: '+1 (555) 555-6666',
      loyaltyPoints: 750
    });
    
    await Promise.all([
      lowPointsCustomer.save(),
      mediumPointsCustomer.save(),
      highPointsCustomer.save()
    ]);
    
    // Find customers with at least 200 points
    const loyalCustomers = await Customer.findByLoyaltyPointsRange(200);
    expect(loyalCustomers.length).toBe(2);
    
    // Find customers between 100 and 500 points
    const midTierCustomers = await Customer.findByLoyaltyPointsRange(100, 500);
    expect(midTierCustomers.length).toBe(1);
    expect(midTierCustomers[0].loyaltyPoints).toBe(250);
  });
});