/**
 * Reservation Workflow Integration Tests
 * 
 * Tests the complete end-to-end flow of the bike reservation process:
 * 1. User authentication
 * 2. Availability checking
 * 3. Reservation creation
 * 4. Payment processing
 * 5. Reservation retrieval
 * 6. Reservation updates
 * 7. Reservation cancellation or completion
 */
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Express } from 'express';
import { createServer } from '../../../src/backend/server';
import { UserRole } from '../../../src/shared/types/models';

// Import models for direct database manipulation
import User from '../../../src/backend/models/user.model';
import Customer from '../../../src/backend/models/customer.model';
import Bike from '../../../src/backend/models/bike.model';
import Station from '../../../src/backend/models/station.model';
import Reservation from '../../../src/backend/models/reservation.model';

describe('Reservation Workflow Integration', () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;
  
  // Test data
  let customerToken: string;
  let staffToken: string;
  let adminToken: string;
  let refreshToken: string;
  let customerId: string;
  let userId: string;
  let bike1Id: string;
  let bike2Id: string;
  let stationDowntownId: string;
  let stationUptownId: string;
  let reservationId: string;
  
  // Test users
  const testCustomer = {
    email: 'customer@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'Customer',
    role: UserRole.CUSTOMER,
  };
  
  const testStaff = {
    email: 'staff@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'Staff',
    role: UserRole.STAFF,
  };
  
  const testAdmin = {
    email: 'admin@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'Admin',
    role: UserRole.ADMIN,
  };
  
  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Mock environment variables
    process.env.MONGO_URI = mongoUri;
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    
    // Connect to database
    await mongoose.connect(mongoUri);
    
    // Create Express app with all routes
    app = await createServer();
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(async () => {
    // Clear database collections
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Bike.deleteMany({});
    await Station.deleteMany({});
    await Reservation.deleteMany({});
    
    // Create test users
    // 1. Register customer
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(testCustomer);
      
    userId = registerResponse.body.data.user._id;
    customerToken = registerResponse.body.data.token;
    
    // Get customer id
    const customer = await Customer.findOne({ userId });
    customerId = customer._id.toString();
    
    // 2. Create staff and admin users directly
    const staffUser = await User.create(testStaff);
    const adminUser = await User.create(testAdmin);
    
    // Login to get tokens
    const staffLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testStaff.email,
        password: testStaff.password,
      });
    staffToken = staffLoginResponse.body.data.token;
    
    const adminLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testAdmin.email,
        password: testAdmin.password,
      });
    adminToken = adminLoginResponse.body.data.token;
    refreshToken = adminLoginResponse.body.data.refreshToken;
    
    // Create test stations
    const downtownStation = await Station.create({
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
    stationDowntownId = downtownStation._id.toString();
    
    const uptownStation = await Station.create({
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
    stationUptownId = uptownStation._id.toString();
    
    // Create test bikes
    const mountainBike = await Bike.create({
      name: 'Mountain Bike Pro',
      type: 'mountain',
      condition: 'excellent',
      isAvailable: true,
      currentStationId: stationDowntownId,
      hourlyRate: 12.99,
      dailyRate: 45.99,
      features: ['suspension', '21-speed', 'disc-brakes'],
    });
    bike1Id = mountainBike._id.toString();
    
    const roadBike = await Bike.create({
      name: 'Road Bike Speed',
      type: 'road',
      condition: 'good',
      isAvailable: true,
      currentStationId: stationDowntownId,
      hourlyRate: 10.99,
      dailyRate: 39.99,
      features: ['lightweight', '18-speed', 'racing-tires'],
    });
    bike2Id = roadBike._id.toString();
  });
  
  // Test full end-to-end happy path flow
  describe('Happy Path: Complete Reservation Workflow', () => {
    test('should complete a full reservation life cycle', async () => {
      //
      // Step 1: Check bike availability
      //
      const availabilityResponse = await request(app)
        .get('/api/v1/reservations/availability')
        .query({
          bikes: [bike1Id],
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),  // Day after tomorrow
        });
      
      expect(availabilityResponse.status).toBe(200);
      expect(availabilityResponse.body.success).toBe(true);
      expect(availabilityResponse.body.data.available).toBe(true);
      
      //
      // Step 2: Create a new reservation
      //
      const createReservationData = {
        customerId: customerId,
        bikes: [bike1Id],
        startStation: stationDowntownId,
        endStation: stationUptownId,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),  // Day after tomorrow
        additionalServices: [
          {
            name: 'helmet rental',
            price: 5.99,
            quantity: 1,
          },
          {
            name: 'bike lock',
            price: 3.99,
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
      
      const createReservationResponse = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(createReservationData);
      
      expect(createReservationResponse.status).toBe(201);
      expect(createReservationResponse.body.success).toBe(true);
      expect(createReservationResponse.body.data._id).toBeDefined();
      expect(createReservationResponse.body.data.status).toBe('pending');
      expect(createReservationResponse.body.data.paymentStatus).toBe('pending');
      expect(createReservationResponse.body.data.confirmationCode).toBeDefined();
      expect(createReservationResponse.body.data.bikes).toContain(bike1Id);
      
      reservationId = createReservationResponse.body.data._id;
      
      //
      // Step 3: Check availability again (bike should be unavailable now)
      //
      const availabilityResponse2 = await request(app)
        .get('/api/v1/reservations/availability')
        .query({
          bikes: [bike1Id],
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),  // Day after tomorrow
        });
      
      expect(availabilityResponse2.status).toBe(200);
      expect(availabilityResponse2.body.success).toBe(true);
      expect(availabilityResponse2.body.data.available).toBe(false);
      expect(availabilityResponse2.body.data.conflicts.length).toBe(1);
      
      //
      // Step 4: Simulate payment process (admin updates payment status)
      //
      const updatePaymentResponse = await request(app)
        .put(`/api/v1/reservations/${reservationId}/payment-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          paymentStatus: 'paid',
          transactionId: 'sim_transaction_12345',
        });
      
      expect(updatePaymentResponse.status).toBe(200);
      expect(updatePaymentResponse.body.success).toBe(true);
      expect(updatePaymentResponse.body.data.paymentStatus).toBe('paid');
      expect(updatePaymentResponse.body.data.status).toBe('confirmed');
      
      //
      // Step 5: Customer retrieves reservation details
      //
      const getReservationResponse = await request(app)
        .get(`/api/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(getReservationResponse.status).toBe(200);
      expect(getReservationResponse.body.success).toBe(true);
      expect(getReservationResponse.body.data._id).toBe(reservationId);
      expect(getReservationResponse.body.data.status).toBe('confirmed');
      expect(getReservationResponse.body.data.bikes).toContain(bike1Id);
      
      //
      // Step 6: Simulate active reservation (when rental period starts)
      //
      const activateResponse = await request(app)
        .post(`/api/v1/reservations/${reservationId}/activate`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          checkoutNotes: 'Bike in excellent condition at checkout',
          staffId: 'sim_staff_id',
        });
      
      expect(activateResponse.status).toBe(200);
      expect(activateResponse.body.success).toBe(true);
      expect(activateResponse.body.data.status).toBe('active');
      
      //
      // Step 7: Complete the reservation (simulate return)
      //
      const completeResponse = await request(app)
        .post(`/api/v1/reservations/${reservationId}/complete`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          actualReturnDate: new Date().toISOString(),
          condition: 'good',
          processedBy: 'sim_staff_id',
          returnLocation: stationUptownId,
          damageReport: 'No damage',
          feedback: {
            rating: 5,
            comment: 'Great experience!',
          },
        });
      
      expect(completeResponse.status).toBe(200);
      expect(completeResponse.body.success).toBe(true);
      expect(completeResponse.body.data.status).toBe('completed');
      expect(completeResponse.body.data.returnDetails).toBeDefined();
      expect(completeResponse.body.data.returnDetails.condition).toBe('good');
      
      // Verify bike is back at the return station
      const updatedBike = await Bike.findById(bike1Id);
      expect(updatedBike.isAvailable).toBe(true);
      expect(updatedBike.currentStationId.toString()).toBe(stationUptownId);
    });
  });
  
  // Test reservation cancellation flow
  describe('Cancellation Flow: User cancels reservation', () => {
    beforeEach(async () => {
      // Create a reservation to cancel
      const createReservationData = {
        customerId: customerId,
        bikes: [bike2Id],
        startStation: stationDowntownId,
        endStation: stationUptownId,
        startDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 3 days from now
        endDate: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),  // 4 days from now
      };
      
      const createResponse = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(createReservationData);
      
      reservationId = createResponse.body.data._id;
      
      // Confirm the reservation (simulate payment)
      await request(app)
        .put(`/api/v1/reservations/${reservationId}/payment-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          paymentStatus: 'paid',
          transactionId: 'sim_transaction_cancel_test',
        });
    });
    
    test('should allow customer to cancel confirmed reservation', async () => {
      const cancelResponse = await request(app)
        .post(`/api/v1/reservations/${reservationId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          reason: 'Change of plans',
        });
      
      expect(cancelResponse.status).toBe(200);
      expect(cancelResponse.body.success).toBe(true);
      expect(cancelResponse.body.data.status).toBe('cancelled');
      expect(cancelResponse.body.data.cancelReason).toBe('Change of plans');
      expect(cancelResponse.body.data.cancelledBy).toBe(userId);
      
      // Verify bike is available again
      const updatedBike = await Bike.findById(bike2Id);
      expect(updatedBike.isAvailable).toBe(true);
      
      // Verify cannot double-cancel
      const secondCancelResponse = await request(app)
        .post(`/api/v1/reservations/${reservationId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          reason: 'Trying to cancel again',
        });
      
      expect(secondCancelResponse.status).toBe(400);
      expect(secondCancelResponse.body.success).toBe(false);
    });
    
    test('should not allow other customers to cancel someone else\'s reservation', async () => {
      // Register another customer
      const anotherCustomerData = {
        email: 'anothercustomer@example.com',
        password: 'Password123!',
        firstName: 'Another',
        lastName: 'Customer',
        role: UserRole.CUSTOMER,
      };
      
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(anotherCustomerData);
      
      const anotherCustomerToken = registerResponse.body.data.token;
      
      // Try to cancel with different customer
      const cancelResponse = await request(app)
        .post(`/api/v1/reservations/${reservationId}/cancel`)
        .set('Authorization', `Bearer ${anotherCustomerToken}`)
        .send({
          reason: 'Unauthorized cancellation attempt',
        });
      
      expect(cancelResponse.status).toBe(403);
      expect(cancelResponse.body.success).toBe(false);
      
      // Verify reservation was not cancelled
      const reservation = await Reservation.findById(reservationId);
      expect(reservation.status).toBe('confirmed');
    });
  });
  
  // Test staff cancellation and refund flow
  describe('Staff Cancellation Flow: Staff cancels and issues refund', () => {
    beforeEach(async () => {
      // Create a paid reservation
      const createReservationData = {
        customerId: customerId,
        bikes: [bike1Id, bike2Id],
        startStation: stationDowntownId,
        endStation: stationUptownId,
        startDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 2 days from now
        endDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),  // 3 days from now
        additionalServices: [
          {
            name: 'helmet rental',
            price: 5.99,
            quantity: 2,
          },
        ],
      };
      
      const createResponse = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(createReservationData);
      
      reservationId = createResponse.body.data._id;
      
      // Confirm the reservation (simulate payment)
      await request(app)
        .put(`/api/v1/reservations/${reservationId}/payment-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          paymentStatus: 'paid',
          transactionId: 'sim_transaction_staff_cancel',
        });
    });
    
    test('should allow staff to cancel and refund reservation', async () => {
      const cancelResponse = await request(app)
        .post(`/api/v1/reservations/${reservationId}/admin-cancel`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          reason: 'Weather conditions',
          refundAmount: 55.99,
          refundTransactionId: 'sim_refund_12345',
          notifyCustomer: true,
        });
      
      expect(cancelResponse.status).toBe(200);
      expect(cancelResponse.body.success).toBe(true);
      expect(cancelResponse.body.data.status).toBe('cancelled');
      expect(cancelResponse.body.data.cancelReason).toBe('Weather conditions');
      expect(cancelResponse.body.data.paymentStatus).toBe('refunded');
      expect(cancelResponse.body.data.refundDetails).toBeDefined();
      expect(cancelResponse.body.data.refundDetails.amount).toBe(55.99);
      expect(cancelResponse.body.data.refundDetails.transactionId).toBe('sim_refund_12345');
      
      // Verify bikes are available again
      const bike1 = await Bike.findById(bike1Id);
      const bike2 = await Bike.findById(bike2Id);
      expect(bike1.isAvailable).toBe(true);
      expect(bike2.isAvailable).toBe(true);
    });
  });
  
  // Test modify reservation flow
  describe('Modify Reservation Flow', () => {
    beforeEach(async () => {
      // Create a reservation to modify
      const createReservationData = {
        customerId: customerId,
        bikes: [bike1Id],
        startStation: stationDowntownId,
        endStation: stationUptownId,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),  // Day after tomorrow
      };
      
      const createResponse = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(createReservationData);
      
      reservationId = createResponse.body.data._id;
    });
    
    test('should allow customer to modify pending reservation', async () => {
      const updateData = {
        bikes: [bike1Id, bike2Id], // Add another bike
        endDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // Extend by a day
        additionalServices: [
          {
            name: 'helmet rental',
            price: 5.99,
            quantity: 2,
          },
        ],
        notes: 'Extended trip with additional bike',
      };
      
      const updateResponse = await request(app)
        .put(`/api/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.bikes.length).toBe(2);
      expect(updateResponse.body.data.bikes).toContain(bike1Id);
      expect(updateResponse.body.data.bikes).toContain(bike2Id);
      expect(new Date(updateResponse.body.data.endDate)).toEqual(new Date(updateData.endDate));
      expect(updateResponse.body.data.notes).toBe(updateData.notes);
      expect(updateResponse.body.data.additionalServices.length).toBe(1);
      expect(updateResponse.body.data.additionalServices[0].quantity).toBe(2);
      
      // Verify total amount was updated
      expect(updateResponse.body.data.totalAmount).toBeGreaterThan(0);
      // Total should reflect second bike and extended rental period
      const originalReservation = await Reservation.findById(reservationId);
      expect(updateResponse.body.data.totalAmount).toBeGreaterThan(originalReservation.totalAmount);
    });
    
    test('should not allow modifying confirmed reservation', async () => {
      // First confirm the reservation
      await request(app)
        .put(`/api/v1/reservations/${reservationId}/payment-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          paymentStatus: 'paid',
          transactionId: 'sim_transaction_modify_test',
        });
      
      // Then try to modify it
      const updateData = {
        bikes: [bike1Id, bike2Id],
        notes: 'Should not be allowed to modify confirmed reservation',
      };
      
      const updateResponse = await request(app)
        .put(`/api/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData);
      
      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.success).toBe(false);
      expect(updateResponse.body.error).toBeDefined();
    });
  });
  
  // Test failed payment flow
  describe('Failed Payment Flow', () => {
    test('should handle failed payment appropriately', async () => {
      // Create a reservation
      const createReservationData = {
        customerId: customerId,
        bikes: [bike1Id],
        startStation: stationDowntownId,
        endStation: stationUptownId,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),  // Day after tomorrow
      };
      
      const createResponse = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(createReservationData);
      
      reservationId = createResponse.body.data._id;
      
      // Update payment status to failed
      const updatePaymentResponse = await request(app)
        .put(`/api/v1/reservations/${reservationId}/payment-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          paymentStatus: 'failed',
          failureReason: 'Insufficient funds',
        });
      
      expect(updatePaymentResponse.status).toBe(200);
      expect(updatePaymentResponse.body.success).toBe(true);
      expect(updatePaymentResponse.body.data.paymentStatus).toBe('failed');
      expect(updatePaymentResponse.body.data.paymentDetails.failureReason).toBe('Insufficient funds');
      
      // Verify reservation status is still pending
      expect(updatePaymentResponse.body.data.status).toBe('pending');
      
      // Check that customer can still update the reservation
      const updateData = {
        additionalServices: [
          {
            name: 'helmet rental',
            price: 5.99,
            quantity: 1,
          },
        ],
      };
      
      const updateResponse = await request(app)
        .put(`/api/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.additionalServices.length).toBe(1);
      
      // Retry payment (success this time)
      const retryPaymentResponse = await request(app)
        .put(`/api/v1/reservations/${reservationId}/payment-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          paymentStatus: 'paid',
          transactionId: 'sim_transaction_retry',
        });
      
      expect(retryPaymentResponse.status).toBe(200);
      expect(retryPaymentResponse.body.success).toBe(true);
      expect(retryPaymentResponse.body.data.paymentStatus).toBe('paid');
      expect(retryPaymentResponse.body.data.status).toBe('confirmed');
    });
  });
  
  // Test authentication token refresh during reservation process
  describe('Authentication Token Refresh', () => {
    test('should maintain session with token refresh', async () => {
      // Step 1: Create a reservation with current token
      const createReservationData = {
        customerId: customerId,
        bikes: [bike1Id],
        startStation: stationDowntownId,
        endStation: stationUptownId,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      };
      
      const createResponse = await request(app)
        .post('/api/v1/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(createReservationData);
      
      expect(createResponse.status).toBe(201);
      reservationId = createResponse.body.data._id;
      
      // Step 2: Refresh token
      const refreshResponse = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });
      
      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body.success).toBe(true);
      expect(refreshResponse.body.data.token).toBeDefined();
      
      const newToken = refreshResponse.body.data.token;
      const newRefreshToken = refreshResponse.body.data.newRefreshToken;
      
      // Step 3: Use new token to view reservation
      const getReservationResponse = await request(app)
        .get(`/api/v1/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${newToken}`);
      
      expect(getReservationResponse.status).toBe(200);
      expect(getReservationResponse.body.success).toBe(true);
      expect(getReservationResponse.body.data._id).toBe(reservationId);
      
      // Step 4: Verify old refresh token no longer works
      const oldRefreshResponse = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });
      
      expect(oldRefreshResponse.status).toBe(401);
      expect(oldRefreshResponse.body.success).toBe(false);
      
      // Step 5: Verify new refresh token works
      const newRefreshResponse = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: newRefreshToken });
      
      expect(newRefreshResponse.status).toBe(200);
      expect(newRefreshResponse.body.success).toBe(true);
    });
  });
});