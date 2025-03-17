/**
 * Authentication API Tests
 * 
 * TDD RED phase tests for authentication endpoints
 */
import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Import routes and middleware
import authRoutes from '../../../src/backend/api/routes/v1/auth.routes';
import { errorMiddleware } from '../../../src/backend/api/middleware/error.middleware';

// Import models
import User from '../../../src/backend/models/user.model';
import Customer from '../../../src/backend/models/customer.model';

// Import types
import { UserRole } from '../../../src/shared/types/models';
import { env } from '../../../src/shared/config/env';

describe('Authentication API', () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;
  
  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.CUSTOMER,
  };
  
  const testAdmin = {
    email: 'admin@example.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
  };
  
  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    
    // Set up Express app
    app = express();
    app.use(express.json());
    
    // Register API routes
    app.use('/api/v1/auth', authRoutes);
    
    // Register error middleware
    app.use(errorMiddleware);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(async () => {
    // Clear database before each test
    await User.deleteMany({});
    await Customer.deleteMany({});
  });
  
  describe('POST /api/v1/auth/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
        
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.firstName).toBe(testUser.firstName);
      expect(response.body.data.user.lastName).toBe(testUser.lastName);
      expect(response.body.data.user.role).toBe(testUser.role);
      expect(response.body.data.token).toBeDefined();
      
      // Check if password is not returned
      expect(response.body.data.user.password).toBeUndefined();
      
      // Verify user was saved to database
      const savedUser = await User.findOne({ email: testUser.email });
      expect(savedUser).toBeTruthy();
      
      // Verify customer profile was created
      const customer = await Customer.findOne({ userId: savedUser._id });
      expect(customer).toBeTruthy();
      expect(customer.loyaltyPoints).toBe(0);
    });
    
    test('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testUser.email,
          // Missing password, firstName, lastName
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should return 409 when user with email already exists', async () => {
      // First create a user
      await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
        
      // Try to register the same user again
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
        
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should validate email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...testUser,
          password: 'weak',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const user = new User(testUser);
      await user.save();
      
      // Create a test admin for login tests
      const admin = new User(testAdmin);
      await admin.save();
    });
    
    test('should login user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      
      // Check if password is not returned
      expect(response.body.data.user.password).toBeUndefined();
    });
    
    test('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should return 401 for non-existing user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        });
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should handle inactive user account', async () => {
      // Make the user inactive
      await User.updateOne(
        { email: testUser.email },
        { isActive: false }
      );
      
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
        
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should update lastLogin timestamp on successful login', async () => {
      const beforeLogin = await User.findOne({ email: testUser.email });
      const initialLastLogin = beforeLogin.lastLogin;
      
      // Wait a moment to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
        
      const afterLogin = await User.findOne({ email: testUser.email });
      
      expect(afterLogin.lastLogin).not.toEqual(initialLastLogin);
      expect(afterLogin.lastLogin).toBeDefined();
    });
  });
  
  describe('POST /api/v1/auth/refresh-token', () => {
    let refreshToken: string;
    
    beforeEach(async () => {
      // Create a test user
      const user = new User(testUser);
      await user.save();
      
      // Generate refresh token
      refreshToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        env.jwt.refreshSecret,
        { expiresIn: env.jwt.refreshExpiresIn }
      );
    });
    
    test('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.newRefreshToken).toBeDefined();
    });
    
    test('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' });
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should return 401 for blacklisted refresh token', async () => {
      // First use the token to refresh
      await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });
        
      // Try to use the same token again
      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('POST /api/v1/auth/forgot-password', () => {
    beforeEach(async () => {
      // Create a test user
      const user = new User(testUser);
      await user.save();
    });
    
    test('should handle password reset request for existing user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: testUser.email });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    test('should not reveal user existence for non-existing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });
        
      // Should still return 200 but not actually send reset
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
  
  describe('GET /api/v1/auth/profile', () => {
    let userToken: string;
    let userId: string;
    
    beforeEach(async () => {
      // Create a test user
      const user = new User(testUser);
      await user.save();
      userId = user._id.toString();
      
      // Create customer profile
      const customer = new Customer({
        userId: user._id,
        phone: '+1234567890',
        loyaltyPoints: 150,
        memberSince: new Date(),
      });
      await customer.save();
      
      // Generate auth token
      userToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
      );
    });
    
    test('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${userToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(userId);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.firstName).toBe(testUser.firstName);
      expect(response.body.data.lastName).toBe(testUser.lastName);
      expect(response.body.data.profile).toBeDefined();
      expect(response.body.data.profile.loyaltyPoints).toBe(150);
      
      // Check if password is not returned
      expect(response.body.data.password).toBeUndefined();
    });
    
    test('should return 401 for missing authentication', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile');
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token');
        
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('PUT /api/v1/auth/profile', () => {
    let userToken: string;
    let userId: string;
    
    beforeEach(async () => {
      // Create a test user
      const user = new User(testUser);
      await user.save();
      userId = user._id.toString();
      
      // Create customer profile
      const customer = new Customer({
        userId: user._id,
        phone: '+1234567890',
        loyaltyPoints: 150,
        memberSince: new Date(),
      });
      await customer.save();
      
      // Generate auth token
      userToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
      );
    });
    
    test('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        profile: {
          phone: '+9876543210',
          address: {
            street: '123 Bike St',
            city: 'Bikeville',
            state: 'Bikestate',
            postalCode: '12345',
            country: 'Bikeland',
          },
          preferences: {
            bikeTypes: ['mountain', 'electric'],
            bikeSize: 'M',
            notificationPreferences: {
              email: true,
              sms: false,
            },
          },
        },
      };
      
      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      expect(response.body.data.profile.phone).toBe(updateData.profile.phone);
      expect(response.body.data.profile.address.city).toBe(updateData.profile.address.city);
      expect(response.body.data.profile.preferences.bikeSize).toBe(updateData.profile.preferences.bikeSize);
      
      // Verify user was updated in database
      const updatedUser = await User.findById(userId);
      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
      
      // Verify customer profile was updated
      const customer = await Customer.findOne({ userId });
      expect(customer.phone).toBe(updateData.profile.phone);
    });
    
    test('should not allow email update', async () => {
      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          email: 'newemail@example.com',
          firstName: 'Updated',
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Updated');
      expect(response.body.data.email).toBe(testUser.email); // Email should not change
    });
    
    test('should not allow role update', async () => {
      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          role: UserRole.ADMIN,
          firstName: 'Updated',
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Updated');
      expect(response.body.data.role).toBe(UserRole.CUSTOMER); // Role should not change
    });
    
    test('should validate profile data', async () => {
      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          firstName: 'A', // Too short
          profile: {
            phone: 'invalid-phone',
          },
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('POST /api/v1/auth/change-password', () => {
    let userToken: string;
    
    beforeEach(async () => {
      // Create a test user
      const user = new User(testUser);
      await user.save();
      
      // Generate auth token
      userToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
      );
    });
    
    test('should change password successfully', async () => {
      const newPassword = 'NewPassword123!';
      
      const response = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword,
          confirmPassword: newPassword,
        });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify user can log in with new password
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        });
        
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
    });
    
    test('should return 400 for incorrect current password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should return 400 when passwords do not match', async () => {
      const response = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword: 'NewPassword123!',
          confirmPassword: 'DifferentPassword123!',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword: 'weak',
          confirmPassword: 'weak',
        });
        
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('POST /api/v1/auth/logout', () => {
    let refreshToken: string;
    
    beforeEach(async () => {
      // Create a test user
      const user = new User(testUser);
      await user.save();
      
      // Generate refresh token
      refreshToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        env.jwt.refreshSecret,
        { expiresIn: env.jwt.refreshExpiresIn }
      );
    });
    
    test('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify refresh token is invalidated
      const refreshResponse = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });
        
      expect(refreshResponse.status).toBe(401);
    });
  });
});