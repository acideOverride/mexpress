/**
 * Reservation API Tests
 * 
 * TDD RED phase tests for reservation endpoints
 */
import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

// Import routes and middleware
import reservationRoutes from '../../../src/backend/api/routes/v1/reservation.routes';
import { errorMiddleware } from '../../../src/backend/api/middleware/error.middleware';
import { authenticate } from '../../../src/backend/api/middleware/auth.middleware';

// Import models
import Reservation from '../../../src/backend/models/reservation.model';
import User from '../../../src/backend/models/user.model';
import Customer from '../../../src/backend/models/customer.model';
import Bike from '../../../src/backend/models/bike.model';
import Station from '../../../src/backend/models/station.model';

// Import types
import { UserRole } from '../../../src/shared/types/models';
import { env } from '../../../src/shared/config/env';

// Mock authenticate middleware
jest.mock('../../../src/backend/api/middleware/auth.middleware', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = {
      id: 'mock-user-id',
      role: UserRole.CUSTOMER,
    };
    next();
  }),
  authorizeRoles: (...roles) => (req, res, next) => next(),
}));

describe('Reservation API', () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;
  let adminToken: string;
  let customerToken: string;
  
  // Test data
  let user1Id: string;
  let user2Id: string;
  let customer1Id: string;
  let customer2Id: string;
  let bike1Id: string;
  let bike2Id: string;
  let station1Id: string;
  let station2Id: string;
  
  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    
    // Set up Express app
    app = express();
    app.use(express.json());
    
    // Register API routes
    app.use('/api/v1/reservations', reservationRoutes);
    
    // Register error middleware
    app.use(errorMiddleware);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(async () => {
    // Clear database before each test
    await Reservation.deleteMany({});
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Bike.deleteMany({});
    await Station.deleteMany({});
    
    // Create test stations
    const station1 = await Station.create({
      name: 'Downtown Station',
      location: {
        type: 'Point',
        coordinates: [-73.98513, 40.748817],
      },
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      },
      capacity: 20,
      isActive: true,
    });
    station1Id = station1._id.toString();
    
    const station2 = await Station.create({
      name: 'Uptown Station',
      location: {
        type: 'Point',
        coordinates: [-73.95083, 40.784482],
      },
      address: {
        street: '456 Park Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10022',
        country: 'USA',
      },
      capacity: 15,
      isActive: true,
    });
    station2Id = station2._id.toString();
    
    // Create test users
    const user1 = await User.create({
      email: 'customer1@example.com',
      password: 'Password123!',
      firstName: 'Customer',
      lastName: 'One',
      role: UserRole.CUSTOMER,
      isActive: true,
    });
    user1Id = user1._id.toString();
    
    const user2 = await User.create({
      email: 'customer2@example.com',
      password: 'Password123!',
      firstName: 'Customer',
      lastName: 'Two',
      role: UserRole.CUSTOMER,
      isActive: true,
    });
    user2Id = user2._id.toString();
    
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'Password123!',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
    });
    
    // Create test customers
    const customer1 = await Customer.create({
      userId: user1Id,
      phone: '+12125551001',
      loyaltyPoints: 100,
      memberSince: new Date('2023-01-01'),
    });
    customer1Id = customer1._id.toString();
    
    const customer2 = await Customer.create({
      userId: user2Id,
      phone: '+12125552002',
      loyaltyPoints: 50,
      memberSince: new Date('2023-02-01'),
    });
    customer2Id = customer2._id.toString();
    
    // Create test bikes
    const bike1 = await Bike.create({
      name: 'Mountain Bike 1',
      type: 'mountain',
      condition: 'excellent',
      isAvailable: true,
      currentStationId: station1Id,
    });
    bike1Id = bike1._id.toString();
    
    const bike2 = await Bike.create({
      name: 'Road Bike 1',
      type: 'road',
      condition: 'good',
      isAvailable: true,
      currentStationId: station1Id,
    });
    bike2Id = bike2._id.toString();
    
    // Create tokens for testing
    adminToken = jwt.sign(
      { id: adminUser._id, role: UserRole.ADMIN },
      env.jwt.secret,
      { expiresIn: '1h' }
    );
    
    customerToken = jwt.sign(
      { id: user1Id, role: UserRole.CUSTOMER },
      env.jwt.secret,
      { expiresIn: '1h' }
    );
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  describe('POST /api/v1/reservations', () => {
    test('should create a new reservation', async () => {
      const newReservation = {
        customerId: customer1Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        createdBy: user1Id,
        additionalServices: [
          {
            name: 'helmet rental',
            price: 5.99,
            quantity: 1,
          },
        ],
        insurance: {
          type: 'basic',
          coverageAmount: 300,
          price: 10.99,
          termsAccepted: true,
        },
      };
      
      const response = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(newReservation);
        
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.customerId).toBe(customer1Id);
      expect(response.body.data.bikes).toContain(bike1Id);
      expect(response.body.data.startStation).toBe(station1Id);
      expect(response.body.data.endStation).toBe(station2Id);
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.totalAmount).toBeGreaterThan(0);
      expect(response.body.data.paymentStatus).toBe('pending');
      expect(response.body.data.additionalServices.length).toBe(1);
      expect(response.body.data.insurance).toBeDefined();
      expect(response.body.data.confirmationCode).toBeDefined();
      
      // Verify reservation was saved to database
      const savedReservation = await Reservation.findById(response.body.data._id);
      expect(savedReservation).toBeTruthy();
      expect(savedReservation.customerId.toString()).toBe(customer1Id);
    });
    
    test('should return 400 when required fields are missing', async () => {
      const invalidReservation = {
        // Missing customerId, bikes, startStation, startDate, endDate
        endStation: station2Id,
      };
      
      const response = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(invalidReservation);
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should not allow past dates', async () => {
      const invalidReservation = {
        customerId: customer1Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        createdBy: user1Id,
      };
      
      const response = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(invalidReservation);
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('past');
    });
    
    test('should not allow endDate before startDate', async () => {
      const invalidReservation = {
        customerId: customer1Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        createdBy: user1Id,
      };
      
      const response = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(invalidReservation);
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('end date');
    });
    
    test('should verify bike availability', async () => {
      // First create a reservation for bike1
      const firstReservation = {
        customerId: customer1Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        createdBy: user1Id,
      };
      
      await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(firstReservation);
        
      // Try to reserve the same bike for the same time period
      const overlappingReservation = {
        customerId: customer2Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        createdBy: user2Id,
      };
      
      const response = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(overlappingReservation);
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('unavailable');
    });
    
    test('should calculate correct total amount', async () => {
      const reservation = {
        customerId: customer1Id,
        bikes: [bike1Id, bike2Id], // Two bikes
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 3 days from now
        createdBy: user1Id,
        additionalServices: [
          {
            name: 'helmet rental',
            price: 5.99,
            quantity: 2, // Two helmets
          },
          {
            name: 'bike lock',
            price: 3.99,
            quantity: 1,
          },
        ],
        insurance: {
          type: 'premium',
          coverageAmount: 1000,
          price: 24.99,
          termsAccepted: true,
        },
      };
      
      const response = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(reservation);
        
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      
      // Total should include bike rental + additional services + insurance
      const totalAmount = response.body.data.totalAmount;
      const servicesCost = 5.99 * 2 + 3.99;
      const insuranceCost = 24.99;
      
      expect(totalAmount).toBeGreaterThan(0);
      expect(totalAmount).toBeCloseTo(servicesCost + insuranceCost + response.body.data.bikeRentalCost, 2);
    });
  });
  
  describe('GET /api/v1/reservations', () => {
    beforeEach(async () => {
      // Create sample reservations
      await Reservation.create([
        {
          customerId: customer1Id,
          bikes: [bike1Id],
          startStation: station1Id,
          endStation: station2Id,
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
          status: 'confirmed',
          totalAmount: 50.99,
          paymentStatus: 'paid',
          confirmationCode: 'ABC123',
          createdBy: user1Id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          customerId: customer1Id,
          bikes: [bike2Id],
          startStation: station1Id,
          endStation: station1Id,
          startDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 96 * 60 * 60 * 1000),
          status: 'pending',
          totalAmount: 35.99,
          paymentStatus: 'pending',
          confirmationCode: 'DEF456',
          createdBy: user1Id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          customerId: customer2Id,
          bikes: [bike1Id],
          startStation: station2Id,
          endStation: station1Id,
          startDate: new Date(Date.now() + 120 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 144 * 60 * 60 * 1000),
          status: 'confirmed',
          totalAmount: 45.99,
          paymentStatus: 'paid',
          confirmationCode: 'GHI789',
          createdBy: user2Id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    });
    
    test('should get all reservations for admin', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const response = await request(app)
        .get('/api/v1/reservations')
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(3); // All reservations
    });
    
    test('should get only customer\'s reservations for customer', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const response = await request(app)
        .get('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2); // Only customer1's reservations
      expect(response.body.data.every(r => r.customerId === customer1Id)).toBe(true);
    });
    
    test('should support pagination', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const response = await request(app)
        .get('/api/v1/reservations?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.totalItems).toBe(3);
      expect(response.body.metadata.currentPage).toBe(1);
      expect(response.body.metadata.itemsPerPage).toBe(2);
      expect(response.body.metadata.totalPages).toBe(2);
    });
    
    test('should filter by status', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const response = await request(app)
        .get('/api/v1/reservations?status=confirmed')
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data.every(r => r.status === 'confirmed')).toBe(true);
    });
    
    test('should filter by date range', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const startDateFilter = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      const endDateFilter = new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString();
      
      const response = await request(app)
        .get(`/api/v1/reservations?startDate=${startDateFilter}&endDate=${endDateFilter}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1); // Only the second reservation
      expect(response.body.data[0].confirmationCode).toBe('DEF456');
    });
    
    test('should filter by station', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const response = await request(app)
        .get(`/api/v1/reservations?station=${station2Id}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2); // First (end station) and third (start station)
    });
  });
  
  describe('GET /api/v1/reservations/:id', () => {
    let testReservationId: string;
    let otherCustomerReservationId: string;
    
    beforeEach(async () => {
      // Create a test reservation for customer1
      const testReservation = await Reservation.create({
        customerId: customer1Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'confirmed',
        totalAmount: 50.99,
        paymentStatus: 'paid',
        confirmationCode: 'ABC123',
        createdBy: user1Id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      testReservationId = testReservation._id.toString();
      
      // Create a test reservation for customer2
      const otherReservation = await Reservation.create({
        customerId: customer2Id,
        bikes: [bike2Id],
        startStation: station2Id,
        endStation: station1Id,
        startDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 96 * 60 * 60 * 1000),
        status: 'pending',
        totalAmount: 45.99,
        paymentStatus: 'pending',
        confirmationCode: 'DEF456',
        createdBy: user2Id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      otherCustomerReservationId = otherReservation._id.toString();
    });
    
    test('should get a reservation by ID for admin', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const response = await request(app)
        .get(`/api/v1/reservations/${testReservationId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testReservationId);
      expect(response.body.data.customerId).toBe(customer1Id);
      expect(response.body.data.confirmationCode).toBe('ABC123');
    });
    
    test('should allow customer to view their own reservation', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const response = await request(app)
        .get(`/api/v1/reservations/${testReservationId}`)
        .set('Authorization', `Bearer ${customerToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testReservationId);
      expect(response.body.data.customerId).toBe(customer1Id);
    });
    
    test('should not allow customer to view other customers\' reservations', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const response = await request(app)
        .get(`/api/v1/reservations/${otherCustomerReservationId}`)
        .set('Authorization', `Bearer ${customerToken}`);
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should return 404 for non-existent reservation', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/v1/reservations/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('PUT /api/v1/reservations/:id', () => {
    let testReservationId: string;
    
    beforeEach(async () => {
      // Create a test reservation for customer1
      const testReservation = await Reservation.create({
        customerId: customer1Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'pending',
        totalAmount: 50.99,
        paymentStatus: 'pending',
        confirmationCode: 'ABC123',
        createdBy: user1Id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      testReservationId = testReservation._id.toString();
    });
    
    test('should update a reservation', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const updateData = {
        bikes: [bike1Id, bike2Id], // Add another bike
        endDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // Extend end date
        additionalServices: [
          {
            name: 'helmet rental',
            price: 5.99,
            quantity: 2,
          },
        ],
        notes: 'Updated reservation',
      };
      
      const response = await request(app)
        .put(`/api/v1/reservations/${testReservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testReservationId);
      expect(response.body.data.bikes.length).toBe(2);
      expect(response.body.data.bikes).toContain(bike2Id);
      expect(new Date(response.body.data.endDate)).toEqual(new Date(updateData.endDate));
      expect(response.body.data.notes).toBe(updateData.notes);
      expect(response.body.data.additionalServices.length).toBe(1);
      expect(response.body.data.totalAmount).toBeGreaterThan(50.99); // Should increase with additional bike and services
      
      // Verify reservation was updated in database
      const updatedReservation = await Reservation.findById(testReservationId);
      expect(updatedReservation.bikes.length).toBe(2);
      expect(updatedReservation.notes).toBe(updateData.notes);
    });
    
    test('should not allow updating a confirmed reservation', async () => {
      // Set the reservation status to confirmed
      await Reservation.findByIdAndUpdate(testReservationId, { status: 'confirmed' });
      
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const updateData = {
        bikes: [bike1Id, bike2Id],
        notes: 'Updated confirmed reservation',
      };
      
      const response = await request(app)
        .put(`/api/v1/reservations/${testReservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData);
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('confirmed');
    });
    
    test('should not allow customer to update other customers\' reservations', async () => {
      // Create a reservation for another customer
      const otherReservation = await Reservation.create({
        customerId: customer2Id,
        bikes: [bike2Id],
        startStation: station2Id,
        endStation: station1Id,
        startDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 96 * 60 * 60 * 1000),
        status: 'pending',
        totalAmount: 45.99,
        paymentStatus: 'pending',
        confirmationCode: 'DEF456',
        createdBy: user2Id,
      });
      
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const updateData = {
        notes: 'Trying to update someone else\'s reservation',
      };
      
      const response = await request(app)
        .put(`/api/v1/reservations/${otherReservation._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData);
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should validate bike availability when updating', async () => {
      // Create another reservation for the same time period with bike2
      await Reservation.create({
        customerId: customer2Id,
        bikes: [bike2Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'confirmed',
        totalAmount: 40.99,
        paymentStatus: 'paid',
        confirmationCode: 'XYZ789',
        createdBy: user2Id,
      });
      
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      // Try to update with the already reserved bike2
      const updateData = {
        bikes: [bike1Id, bike2Id], // Add bike2, which is already reserved
      };
      
      const response = await request(app)
        .put(`/api/v1/reservations/${testReservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData);
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('unavailable');
    });
  });
  
  describe('POST /api/v1/reservations/:id/cancel', () => {
    let testReservationId: string;
    
    beforeEach(async () => {
      // Create a test reservation for customer1
      const testReservation = await Reservation.create({
        customerId: customer1Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'confirmed',
        totalAmount: 50.99,
        paymentStatus: 'paid',
        confirmationCode: 'ABC123',
        createdBy: user1Id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      testReservationId = testReservation._id.toString();
    });
    
    test('should cancel a reservation', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const cancelData = {
        reason: 'Change of plans',
      };
      
      const response = await request(app)
        .post(`/api/v1/reservations/${testReservationId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(cancelData);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testReservationId);
      expect(response.body.data.status).toBe('cancelled');
      expect(response.body.data.cancelReason).toBe(cancelData.reason);
      expect(response.body.data.cancelledBy).toBe(user1Id);
      expect(response.body.data.cancelledAt).toBeDefined();
      
      // Verify reservation was cancelled in database
      const cancelledReservation = await Reservation.findById(testReservationId);
      expect(cancelledReservation.status).toBe('cancelled');
      expect(cancelledReservation.cancelReason).toBe(cancelData.reason);
    });
    
    test('should not allow cancelling a past reservation', async () => {
      // Update the reservation to have a past start date
      await Reservation.findByIdAndUpdate(testReservationId, {
        startDate: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        endDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        status: 'completed',
      });
      
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const response = await request(app)
        .post(`/api/v1/reservations/${testReservationId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ reason: 'Trying to cancel past reservation' });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('cannot be cancelled');
    });
    
    test('should not allow customer to cancel other customers\' reservations', async () => {
      // Create a reservation for another customer
      const otherReservation = await Reservation.create({
        customerId: customer2Id,
        bikes: [bike2Id],
        startStation: station2Id,
        endStation: station1Id,
        startDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 96 * 60 * 60 * 1000),
        status: 'confirmed',
        totalAmount: 45.99,
        paymentStatus: 'paid',
        confirmationCode: 'DEF456',
        createdBy: user2Id,
      });
      
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const response = await request(app)
        .post(`/api/v1/reservations/${otherReservation._id}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ reason: 'Trying to cancel someone else\'s reservation' });
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should allow admin to cancel any reservation', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const response = await request(app)
        .post(`/api/v1/reservations/${testReservationId}/cancel`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Administrative cancellation' });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('cancelled');
    });
  });
  
  describe('POST /api/v1/reservations/:id/complete', () => {
    let testReservationId: string;
    
    beforeEach(async () => {
      // Create a test active reservation for customer1
      const testReservation = await Reservation.create({
        customerId: customer1Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        endDate: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
        status: 'active',
        totalAmount: 50.99,
        paymentStatus: 'paid',
        confirmationCode: 'ABC123',
        createdBy: user1Id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      testReservationId = testReservation._id.toString();
    });
    
    test('should complete a reservation (staff only)', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const completeData = {
        actualReturnDate: new Date().toISOString(),
        condition: 'good',
        additionalCharges: 0,
        notes: 'Returned on time in good condition',
        processedBy: 'mock-admin-id',
        damageReport: 'No damage',
        returnLocation: station2Id,
        feedback: {
          rating: 5,
          comment: 'Great experience!',
        },
      };
      
      const response = await request(app)
        .post(`/api/v1/reservations/${testReservationId}/complete`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(completeData);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testReservationId);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.returnDetails).toBeDefined();
      expect(response.body.data.returnDetails.condition).toBe(completeData.condition);
      expect(response.body.data.returnDetails.feedback.rating).toBe(completeData.feedback.rating);
      
      // Verify reservation was completed in database
      const completedReservation = await Reservation.findById(testReservationId);
      expect(completedReservation.status).toBe('completed');
      expect(completedReservation.returnDetails).toBeDefined();
      
      // Verify bike is now available at the return location
      const updatedBike = await Bike.findById(bike1Id);
      expect(updatedBike.isAvailable).toBe(true);
      expect(updatedBike.currentStationId.toString()).toBe(station2Id);
    });
    
    test('should not allow customer to complete reservations', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const response = await request(app)
        .post(`/api/v1/reservations/${testReservationId}/complete`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          actualReturnDate: new Date().toISOString(),
          condition: 'good',
          processedBy: user1Id,
          returnLocation: station2Id,
        });
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should add late return fees if returned after end date', async () => {
      // Update the reservation to have a past end date
      await Reservation.findByIdAndUpdate(testReservationId, {
        endDate: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      });
      
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const completeData = {
        actualReturnDate: new Date().toISOString(),
        condition: 'good',
        processedBy: 'mock-admin-id',
        returnLocation: station2Id,
      };
      
      const response = await request(app)
        .post(`/api/v1/reservations/${testReservationId}/complete`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(completeData);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.returnDetails.additionalCharges).toBeGreaterThan(0);
      expect(response.body.data.returnDetails.lateReturnHours).toBeGreaterThan(0);
    });
    
    test('should add damage fees if condition is poor', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const completeData = {
        actualReturnDate: new Date().toISOString(),
        condition: 'damaged',
        processedBy: 'mock-admin-id',
        returnLocation: station2Id,
        damageReport: 'Scratches on frame, bent wheel',
        additionalCharges: 35.00,
      };
      
      const response = await request(app)
        .post(`/api/v1/reservations/${testReservationId}/complete`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(completeData);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.returnDetails.condition).toBe('damaged');
      expect(response.body.data.returnDetails.additionalCharges).toBe(35.00);
      expect(response.body.data.returnDetails.damageReport).toBe(completeData.damageReport);
      
      // Verify bike condition is updated
      const updatedBike = await Bike.findById(bike1Id);
      expect(updatedBike.condition).toBe('damaged');
    });
  });
  
  describe('GET /api/v1/reservations/availability', () => {
    beforeEach(async () => {
      // Create a reservation for bike1
      await Reservation.create({
        customerId: customer1Id,
        bikes: [bike1Id],
        startStation: station1Id,
        endStation: station2Id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
        status: 'confirmed',
        totalAmount: 50.99,
        paymentStatus: 'paid',
        confirmationCode: 'ABC123',
        createdBy: user1Id,
      });
    });
    
    test('should check bike availability', async () => {
      const response = await request(app)
        .get('/api/v1/reservations/availability')
        .query({
          bikes: [bike1Id, bike2Id],
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.available).toBe(false); // bike1 is not available
      expect(response.body.data.conflicts).toBeDefined();
      expect(response.body.data.conflicts.length).toBe(1);
      expect(response.body.data.conflicts[0].bikes[0]._id).toBe(bike1Id);
    });
    
    test('should confirm availability for available time period', async () => {
      const response = await request(app)
        .get('/api/v1/reservations/availability')
        .query({
          bikes: [bike1Id, bike2Id],
          startDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 3 days from now
          endDate: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(), // 4 days from now
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.available).toBe(true);
      expect(response.body.data.conflicts).toEqual([]);
    });
    
    test('should check availability for specific bike', async () => {
      const response = await request(app)
        .get('/api/v1/reservations/availability')
        .query({
          bikes: [bike2Id], // Only bike2, which is available
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.available).toBe(true);
    });
    
    test('should validate required query parameters', async () => {
      const response = await request(app)
        .get('/api/v1/reservations/availability')
        .query({
          bikes: [bike1Id],
          // Missing dates
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('GET /api/v1/reservations/stats', () => {
    beforeEach(async () => {
      // Create sample reservations with different statuses
      await Reservation.insertMany([
        {
          customerId: customer1Id,
          bikes: [bike1Id],
          startStation: station1Id,
          endStation: station2Id,
          startDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: 'completed',
          totalAmount: 50.99,
          paymentStatus: 'paid',
          confirmationCode: 'ABC123',
          createdBy: user1Id,
          createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
        },
        {
          customerId: customer1Id,
          bikes: [bike2Id],
          startStation: station1Id,
          endStation: station1Id,
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
          status: 'confirmed',
          totalAmount: 35.99,
          paymentStatus: 'paid',
          confirmationCode: 'DEF456',
          createdBy: user1Id,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
        {
          customerId: customer2Id,
          bikes: [bike1Id],
          startStation: station2Id,
          endStation: station1Id,
          startDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 96 * 60 * 60 * 1000),
          status: 'pending',
          totalAmount: 45.99,
          paymentStatus: 'pending',
          confirmationCode: 'GHI789',
          createdBy: user2Id,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          customerId: customer2Id,
          bikes: [bike2Id],
          startStation: station1Id,
          endStation: station2Id,
          startDate: new Date(Date.now() - 96 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 72 * 60 * 60 * 1000),
          status: 'cancelled',
          totalAmount: 40.99,
          paymentStatus: 'refunded',
          confirmationCode: 'JKL012',
          createdBy: user2Id,
          createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000),
          cancelledAt: new Date(Date.now() - 110 * 60 * 60 * 1000),
        },
      ]);
    });
    
    test('should get reservation statistics (admin only)', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      const response = await request(app)
        .get('/api/v1/reservations/stats')
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      const stats = response.body.data;
      
      // Verify statistics
      expect(stats.totalReservations).toBe(4);
      expect(stats.statusCounts).toBeDefined();
      expect(stats.statusCounts.completed).toBe(1);
      expect(stats.statusCounts.confirmed).toBe(1);
      expect(stats.statusCounts.pending).toBe(1);
      expect(stats.statusCounts.cancelled).toBe(1);
      
      expect(stats.totalRevenue).toBeCloseTo(50.99 + 35.99, 2); // Only paid reservations
      expect(stats.averageReservationValue).toBeCloseTo((50.99 + 35.99 + 45.99 + 40.99) / 4, 2);
      
      expect(stats.stationUsage).toBeDefined();
      expect(stats.stationUsage.find(s => s._id === station1Id).startCount).toBe(3);
      expect(stats.stationUsage.find(s => s._id === station2Id).startCount).toBe(1);
      
      expect(stats.bikeUsage).toBeDefined();
      expect(stats.bikeUsage.length).toBe(2);
    });
    
    test('should not allow customer to access statistics', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: user1Id,
          role: UserRole.CUSTOMER,
        };
        next();
      });
      
      const response = await request(app)
        .get('/api/v1/reservations/stats')
        .set('Authorization', `Bearer ${customerToken}`);
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should filter statistics by date range', async () => {
      // Override the mock authenticate for this test
      (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
        req.user = {
          id: 'mock-admin-id',
          role: UserRole.ADMIN,
        };
        next();
      });
      
      // Last 48 hours only
      const startDateFilter = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const endDateFilter = new Date().toISOString();
      
      const response = await request(app)
        .get(`/api/v1/reservations/stats?startDate=${startDateFilter}&endDate=${endDateFilter}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const stats = response.body.data;
      expect(stats.totalReservations).toBe(2); // Only the ones created in the last 48 hours
    });
  });
});