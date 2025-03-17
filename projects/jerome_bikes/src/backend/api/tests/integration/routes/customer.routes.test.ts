/**
 * Integration tests for Customer Routes
 * @eslint-disable @typescript-eslint/no-explicit-any
 */
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupApiTest, teardownApiTest } from '../../setup';
import Customer from '../../../../models/customer.model';
import User from '../../../../models/user.model';
import { StatusCodes } from 'http-status-codes';

describe('Customer Routes', () => {
  let app: any;
  let mongod: MongoMemoryServer;
  let userIds: mongoose.Types.ObjectId[] = [];
  let customerIds: mongoose.Types.ObjectId[] = [];
  
  // Setup before all tests
  beforeAll(async () => {
    // Setup express app and MongoDB in-memory server
    const setup = await setupApiTest();
    app = setup.app;
    mongod = setup.mongod;
    
    // Create test users
    const user1 = new User({
      email: 'test1@example.com',
      password: 'hashedPassword1',
      firstName: 'Test',
      lastName: 'User1',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const user2 = new User({
      email: 'test2@example.com',
      password: 'hashedPassword2',
      firstName: 'Test',
      lastName: 'User2',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await user1.save();
    await user2.save();
    
    userIds.push(user1._id);
    userIds.push(user2._id);
    
    // Create test customers
    const customer1 = new Customer({
      userId: userIds[0],
      phone: '+1 (555) 123-4567',
      loyaltyPoints: 100,
      verificationStatus: 'verified',
      memberSince: new Date(),
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'Test Country'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await customer1.save();
    customerIds.push(customer1._id);
  });
  
  // Cleanup after all tests
  afterAll(async () => {
    await teardownApiTest(mongod);
  });
  
  describe('POST /api/v1/customers', () => {
    it('should create a new customer', async () => {
      const customerData = {
        userId: userIds[1].toString(),
        phone: '+1 (555) 987-6543',
        address: {
          street: '456 Second St',
          city: 'Another City',
          state: 'Another State',
          postalCode: '54321',
          country: 'Another Country'
        }
      };
      
      const response = await request(app)
        .post('/api/v1/customers')
        .send(customerData)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CREATED);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(customerData.userId);
      expect(response.body.data.phone).toBe(customerData.phone);
      
      // Verify customer was created in the database
      const customer = await Customer.findById(response.body.data._id);
      expect(customer).toBeDefined();
      expect(customer?.userId.toString()).toBe(customerData.userId);
    });
    
    it('should return 409 if customer already exists for user', async () => {
      const customerData = {
        userId: userIds[0].toString(), // Already has a customer profile
        phone: '+1 (555) 111-2222'
      };
      
      const response = await request(app)
        .post('/api/v1/customers')
        .send(customerData)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CONFLICT);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('already exists');
    });
    
    it('should return 400 for invalid data', async () => {
      const invalidData = {
        userId: userIds[1].toString(),
        // Missing required fields
      };
      
      const response = await request(app)
        .post('/api/v1/customers')
        .send(invalidData)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('GET /api/v1/customers/:id', () => {
    it('should get a customer by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/customers/${customerIds[0]}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id).toBe(customerIds[0].toString());
      expect(response.body.data.phone).toBe('+1 (555) 123-4567');
    });
    
    it('should return 404 for non-existent customer', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/v1/customers/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('not found');
    });
    
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/v1/customers/invalid-id')
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('GET /api/v1/customers', () => {
    it('should get customers with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/customers')
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
    
    it('should filter customers', async () => {
      const response = await request(app)
        .get('/api/v1/customers?minLoyaltyPoints=100')
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      // All returned customers should have at least 100 loyalty points
      response.body.data.forEach((customer: any) => {
        expect(customer.loyaltyPoints).toBeGreaterThanOrEqual(100);
      });
    });
  });
  
  describe('PUT /api/v1/customers/:id', () => {
    it('should update a customer', async () => {
      const updateData = {
        phone: '+1 (555) 999-8888',
        address: {
          street: '789 Updated St',
          city: 'Updated City',
          state: 'Updated State',
          postalCode: '98765',
          country: 'Updated Country'
        }
      };
      
      const response = await request(app)
        .put(`/api/v1/customers/${customerIds[0]}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.phone).toBe(updateData.phone);
      expect(response.body.data.address.city).toBe(updateData.address.city);
      
      // Verify customer was updated in the database
      const customer = await Customer.findById(customerIds[0]);
      expect(customer?.phone).toBe(updateData.phone);
    });
  });
});