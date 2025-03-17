/**
 * Customer API Endpoint Tests
 * 
 * Tests for the Customer API endpoints to verify functionality and error handling.
 * Following TDD principles, these tests are created first in the RED phase.
 */
import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import customerRoutes from '../../../src/backend/api/routes/v1/customer.routes';
import { setupErrorHandlers } from '../../../src/backend/api/middleware/error.middleware';
import Customer from '../../../src/backend/models/customer.model';
import User from '../../../src/backend/models/user.model';

describe('Customer API Endpoints', () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;
  let testCustomerId: string;
  let testUserId: string;

  // Test customer data
  const testCustomer = {
    phone: '+33612345678',
    address: {
      street: '123 Rue de Test',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: '75001',
      country: 'France'
    },
    dateOfBirth: new Date('1990-01-01'),
    emergencyContact: {
      name: 'Emergency Contact',
      phone: '+33687654321',
      relationship: 'family'
    },
    notes: 'Test customer notes',
    verificationStatus: 'verified'
  };

  // Test update data
  const updateCustomer = {
    phone: '+33699887766',
    notes: 'Updated test customer notes',
    address: {
      street: '456 Avenue de Test',
      city: 'Lyon',
      state: 'Auvergne-Rhône-Alpes',
      postalCode: '69001',
      country: 'France'
    }
  };

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create Express app
    app = express();
    app.use(express.json());

    // Add customer routes
    app.use('/api/v1/customers', customerRoutes);
    
    // Add error handlers
    setupErrorHandlers(app);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await Customer.deleteMany({});
    await User.deleteMany({});
    
    // Create a test user
    const user = new User({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'hashedPassword123',
      role: 'customer'
    });
    const savedUser = await user.save();
    testUserId = savedUser._id.toString();
    
    // Create a test customer linked to the user
    const customer = new Customer({
      ...testCustomer,
      userId: testUserId
    });
    const savedCustomer = await customer.save();
    testCustomerId = savedCustomer._id.toString();
  });

  describe('POST /api/v1/customers', () => {
    test('should create a new customer with valid data', async () => {
      // Create another user for this test
      const newUser = new User({
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'hashedPassword456',
        role: 'customer'
      });
      const savedUser = await newUser.save();
      
      const newCustomer = {
        ...testCustomer,
        userId: savedUser._id.toString(),
        phone: '+33611223344'
      };
      
      const response = await request(app)
        .post('/api/v1/customers')
        .send(newCustomer)
        .expect('Content-Type', /json/)
        .expect(201);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify customer data in response
      expect(response.body.data.userId).toBe(newCustomer.userId);
      expect(response.body.data.phone).toBe(newCustomer.phone);
      expect(response.body.data._id).toBeDefined();
      
      // Verify customer exists in database
      const storedCustomer = await Customer.findById(response.body.data._id);
      expect(storedCustomer).not.toBeNull();
      expect(storedCustomer?.phone).toBe(newCustomer.phone);
    });

    test('should return 400 for missing required fields', async () => {
      // Missing required fields
      const invalidCustomer = {
        userId: testUserId
        // Missing other required fields like phone
      };
      
      const response = await request(app)
        .post('/api/v1/customers')
        .send(invalidCustomer)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response structure
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
      expect(response.body.error.message).toBeDefined();
    });

    test('should return 400 for duplicate user ID', async () => {
      // Using same user ID as the test customer created in beforeEach
      const duplicateCustomer = {
        ...testCustomer,
        userId: testUserId, // Already linked to a customer
        phone: '+33655443322'
      };
      
      const response = await request(app)
        .post('/api/v1/customers')
        .send(duplicateCustomer)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response structure
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/v1/customers', () => {
    test('should return a list of customers with pagination', async () => {
      // Add a few more customers
      const users = await User.create([
        { email: 'user1@example.com', firstName: 'User1', lastName: 'Test', password: 'hashed1', role: 'customer' },
        { email: 'user2@example.com', firstName: 'User2', lastName: 'Test', password: 'hashed2', role: 'customer' },
        { email: 'user3@example.com', firstName: 'User3', lastName: 'Test', password: 'hashed3', role: 'customer' }
      ]);
      
      await Customer.create([
        { ...testCustomer, userId: users[0]._id, phone: '+33611111111' },
        { ...testCustomer, userId: users[1]._id, phone: '+33622222222' },
        { ...testCustomer, userId: users[2]._id, phone: '+33633333333' }
      ]);
      
      const response = await request(app)
        .get('/api/v1/customers?page=1&limit=2')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.metadata).toBeDefined();
      
      // Verify pagination data
      expect(response.body.metadata.currentPage).toBe(1);
      expect(response.body.metadata.itemsPerPage).toBe(2);
      expect(response.body.metadata.totalItems).toBe(4); // 3 new customers + 1 from beforeEach
      expect(response.body.data.length).toBe(2); // Limit is 2
    });

    test('should filter customers by verification status', async () => {
      // Add customers with different verification statuses
      const users = await User.create([
        { email: 'verified@example.com', firstName: 'Verified', lastName: 'User', password: 'hashed1', role: 'customer' },
        { email: 'pending@example.com', firstName: 'Pending', lastName: 'User', password: 'hashed2', role: 'customer' },
        { email: 'unverified@example.com', firstName: 'Unverified', lastName: 'User', password: 'hashed3', role: 'customer' }
      ]);
      
      await Customer.create([
        { ...testCustomer, userId: users[0]._id, phone: '+33711111111', verificationStatus: 'verified' },
        { ...testCustomer, userId: users[1]._id, phone: '+33722222222', verificationStatus: 'pending' },
        { ...testCustomer, userId: users[2]._id, phone: '+33733333333', verificationStatus: 'unverified' }
      ]);
      
      const response = await request(app)
        .get('/api/v1/customers?verificationStatus=pending')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify filtered results
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].verificationStatus).toBe('pending');
    });

    test('should search customers by phone number', async () => {
      // Add customers with different phone numbers
      const users = await User.create([
        { email: 'phone1@example.com', firstName: 'Phone1', lastName: 'User', password: 'hashed1', role: 'customer' },
        { email: 'phone2@example.com', firstName: 'Phone2', lastName: 'User', password: 'hashed2', role: 'customer' }
      ]);
      
      await Customer.create([
        { ...testCustomer, userId: users[0]._id, phone: '+33765432198' },
        { ...testCustomer, userId: users[1]._id, phone: '+33798765432' }
      ]);
      
      const response = await request(app)
        .get('/api/v1/customers?phone=7654')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify search results
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].phone).toBe('+33765432198');
    });
  });

  describe('GET /api/v1/customers/top', () => {
    test('should return top customers by rental count', async () => {
      // This is just testing the endpoint structure since in reality
      // the rental count would be determined by relationships to reservations
      const response = await request(app)
        .get('/api/v1/customers/top?criteria=rentalCount&limit=5')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    test('should return top customers by loyalty points', async () => {
      // Add customers with different loyalty points
      const users = await User.create([
        { email: 'loyalty1@example.com', firstName: 'Loyalty1', lastName: 'User', password: 'hashed1', role: 'customer' },
        { email: 'loyalty2@example.com', firstName: 'Loyalty2', lastName: 'User', password: 'hashed2', role: 'customer' }
      ]);
      
      await Customer.create([
        { ...testCustomer, userId: users[0]._id, phone: '+33744444444', loyaltyPoints: 500 },
        { ...testCustomer, userId: users[1]._id, phone: '+33755555555', loyaltyPoints: 1000 }
      ]);
      
      const response = await request(app)
        .get('/api/v1/customers/top?criteria=loyaltyPoints&limit=5')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure and order
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // Customers should be ordered by loyalty points (descending)
      if (response.body.data.length >= 2) {
        const loyaltyPoints = response.body.data.map((c: any) => c.loyaltyPoints);
        expect(loyaltyPoints).toEqual(loyaltyPoints.sort((a: number, b: number) => b - a));
      }
    });
  });

  describe('GET /api/v1/customers/:id', () => {
    test('should return customer by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/customers/${testCustomerId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify customer data
      expect(response.body.data._id).toBe(testCustomerId);
      expect(response.body.data.userId).toBe(testUserId);
      expect(response.body.data.phone).toBe(testCustomer.phone);
    });

    test('should return 404 for non-existent customer ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/v1/customers/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(404);
    });

    test('should return 400 for invalid customer ID format', async () => {
      const response = await request(app)
        .get('/api/v1/customers/invalid-id-format')
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
    });
  });

  describe('GET /api/v1/customers/user/:userId', () => {
    test('should return customer by user ID', async () => {
      const response = await request(app)
        .get(`/api/v1/customers/user/${testUserId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify customer data
      expect(response.body.data._id).toBe(testCustomerId);
      expect(response.body.data.userId).toBe(testUserId);
      expect(response.body.data.phone).toBe(testCustomer.phone);
    });

    test('should return 404 for non-existent user ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/v1/customers/user/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(404);
    });
  });

  describe('PUT /api/v1/customers/:id', () => {
    test('should update customer by ID', async () => {
      const response = await request(app)
        .put(`/api/v1/customers/${testCustomerId}`)
        .send(updateCustomer)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify updated data
      expect(response.body.data._id).toBe(testCustomerId);
      expect(response.body.data.phone).toBe(updateCustomer.phone);
      expect(response.body.data.notes).toBe(updateCustomer.notes);
      expect(response.body.data.address.city).toBe(updateCustomer.address.city);
      
      // Verify update in database
      const updatedCustomer = await Customer.findById(testCustomerId);
      expect(updatedCustomer?.phone).toBe(updateCustomer.phone);
      expect(updatedCustomer?.notes).toBe(updateCustomer.notes);
    });

    test('should return 404 for updating non-existent customer', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .put(`/api/v1/customers/${nonExistentId}`)
        .send(updateCustomer)
        .expect('Content-Type', /json/)
        .expect(404);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(404);
    });
  });

  describe('DELETE /api/v1/customers/:id', () => {
    test('should delete customer by ID', async () => {
      const response = await request(app)
        .delete(`/api/v1/customers/${testCustomerId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.message).toBeDefined();
      
      // Verify customer is deleted from database
      const deletedCustomer = await Customer.findById(testCustomerId);
      expect(deletedCustomer).toBeNull();
    });

    test('should return 404 for deleting non-existent customer', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .delete(`/api/v1/customers/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(404);
    });
  });

  describe('POST /api/v1/customers/:id/loyalty-points', () => {
    test('should add loyalty points to customer', async () => {
      const pointsRequest = {
        points: 50,
        reason: 'Test points addition'
      };
      
      const response = await request(app)
        .post(`/api/v1/customers/${testCustomerId}/loyalty-points`)
        .send(pointsRequest)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify points were added
      expect(response.body.data.loyaltyPoints).toBe(50); // Starting from 0
      
      // Verify update in database
      const updatedCustomer = await Customer.findById(testCustomerId);
      expect(updatedCustomer?.loyaltyPoints).toBe(50);
    });

    test('should return 400 for invalid points value', async () => {
      const invalidPointsRequest = {
        points: -10, // Points cannot be negative
        reason: 'Invalid points'
      };
      
      const response = await request(app)
        .post(`/api/v1/customers/${testCustomerId}/loyalty-points`)
        .send(invalidPointsRequest)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
    });
  });

  describe('POST /api/v1/customers/:id/deduct-points', () => {
    test('should deduct loyalty points from customer with sufficient balance', async () => {
      // First add points to the customer
      await Customer.findByIdAndUpdate(testCustomerId, { loyaltyPoints: 100 });
      
      const pointsRequest = {
        points: 30,
        reason: 'Test points deduction'
      };
      
      const response = await request(app)
        .post(`/api/v1/customers/${testCustomerId}/deduct-points`)
        .send(pointsRequest)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify points were deducted
      expect(response.body.data.remainingPoints).toBe(70); // 100 - 30
      expect(response.body.data.deducted).toBe(true);
      
      // Verify update in database
      const updatedCustomer = await Customer.findById(testCustomerId);
      expect(updatedCustomer?.loyaltyPoints).toBe(70);
    });

    test('should return 400 for insufficient points balance', async () => {
      // Set customer points to a low value
      await Customer.findByIdAndUpdate(testCustomerId, { loyaltyPoints: 10 });
      
      const pointsRequest = {
        points: 50, // More than available
        reason: 'Test points deduction'
      };
      
      const response = await request(app)
        .post(`/api/v1/customers/${testCustomerId}/deduct-points`)
        .send(pointsRequest)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
    });
  });

  describe('POST /api/v1/customers/:id/payment-methods', () => {
    test('should add payment method to customer', async () => {
      const paymentMethod = {
        type: 'credit',
        lastFour: '1234',
        expiryDate: '12/30', // Future date
        cardholderName: 'Test User',
        billingAddress: '123 Test St',
        isDefault: true
      };
      
      const response = await request(app)
        .post(`/api/v1/customers/${testCustomerId}/payment-methods`)
        .send(paymentMethod)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify payment method was added
      expect(response.body.data.paymentMethods).toBeInstanceOf(Array);
      expect(response.body.data.paymentMethods.length).toBe(1);
      expect(response.body.data.paymentMethods[0].lastFour).toBe(paymentMethod.lastFour);
      expect(response.body.data.paymentMethods[0].isDefault).toBe(true);
      
      // Verify update in database
      const updatedCustomer = await Customer.findById(testCustomerId);
      expect(updatedCustomer?.paymentMethods).toHaveLength(1);
      expect(updatedCustomer?.paymentMethods[0].lastFour).toBe(paymentMethod.lastFour);
    });

    test('should return 400 for invalid payment method data', async () => {
      const invalidPaymentMethod = {
        type: 'invalid-type', // Not in enum
        lastFour: '123', // Not 4 digits
        expiryDate: '12/20', // Past date
        cardholderName: 'Test User'
      };
      
      const response = await request(app)
        .post(`/api/v1/customers/${testCustomerId}/payment-methods`)
        .send(invalidPaymentMethod)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
    });
  });

  describe('PATCH /api/v1/customers/:id/verification', () => {
    test('should update customer verification status', async () => {
      // Set customer verification status to unverified
      await Customer.findByIdAndUpdate(testCustomerId, { verificationStatus: 'unverified' });
      
      const verificationRequest = {
        status: 'verified',
        notes: 'Identity verified with valid documentation'
      };
      
      const response = await request(app)
        .patch(`/api/v1/customers/${testCustomerId}/verification`)
        .send(verificationRequest)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify verification status was updated
      expect(response.body.data.verificationStatus).toBe(verificationRequest.status);
      
      // Verify update in database
      const updatedCustomer = await Customer.findById(testCustomerId);
      expect(updatedCustomer?.verificationStatus).toBe(verificationRequest.status);
    });

    test('should return 400 for invalid verification status', async () => {
      const invalidVerificationRequest = {
        status: 'invalid-status', // Not in enum
        notes: 'Invalid verification request'
      };
      
      const response = await request(app)
        .patch(`/api/v1/customers/${testCustomerId}/verification`)
        .send(invalidVerificationRequest)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
    });
  });

  describe('PATCH /api/v1/customers/:id/preferences', () => {
    test('should update customer preferences', async () => {
      const preferencesRequest = {
        bikeTypes: ['road', 'electric'],
        bikeSize: 'l',
        notificationPreferences: {
          email: true,
          sms: true,
          push: false
        },
        preferredRentalDuration: 'daily'
      };
      
      const response = await request(app)
        .patch(`/api/v1/customers/${testCustomerId}/preferences`)
        .send(preferencesRequest)
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Verify preferences were updated
      expect(response.body.data.preferences.bikeTypes).toEqual(preferencesRequest.bikeTypes);
      expect(response.body.data.preferences.bikeSize).toBe(preferencesRequest.bikeSize);
      expect(response.body.data.preferences.notificationPreferences.sms).toBe(preferencesRequest.notificationPreferences.sms);
      
      // Verify update in database
      const updatedCustomer = await Customer.findById(testCustomerId);
      expect(updatedCustomer?.preferences.bikeTypes).toEqual(preferencesRequest.bikeTypes);
      expect(updatedCustomer?.preferences.bikeSize).toBe(preferencesRequest.bikeSize);
    });

    test('should return 400 for invalid preferences data', async () => {
      const invalidPreferencesRequest = {
        bikeTypes: ['mountain', 'invalid-type'], // Invalid bike type
        bikeSize: 'xxl', // Invalid size
        notificationPreferences: {
          email: 'yes' // Should be boolean
        }
      };
      
      const response = await request(app)
        .patch(`/api/v1/customers/${testCustomerId}/preferences`)
        .send(invalidPreferencesRequest)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(400);
    });
  });
});