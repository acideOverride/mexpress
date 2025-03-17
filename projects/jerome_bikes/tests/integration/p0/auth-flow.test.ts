/**
 * Authentication Flow Integration Tests
 * 
 * Tests the complete authentication lifecycle:
 * 1. User registration
 * 2. Login
 * 3. Token refresh
 * 4. Profile management
 * 5. Password change
 * 6. Logout
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

describe('Authentication Flow Integration', () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;
  
  // Test data
  const testUser = {
    email: 'testuser@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
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
  });
  
  describe('Complete Authentication Lifecycle', () => {
    test('should go through the entire authentication lifecycle', async () => {
      //
      // Step 1: Register a new user
      //
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testUser.email,
          password: testUser.password,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          role: UserRole.CUSTOMER,
        });
      
      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.user).toBeDefined();
      expect(registerResponse.body.data.user.email).toBe(testUser.email);
      expect(registerResponse.body.data.token).toBeDefined();
      
      const userId = registerResponse.body.data.user._id;
      const initialToken = registerResponse.body.data.token;
      
      // Verify user was saved to database with correct information
      const savedUser = await User.findOne({ email: testUser.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.firstName).toBe(testUser.firstName);
      expect(savedUser.lastName).toBe(testUser.lastName);
      expect(savedUser.role).toBe(UserRole.CUSTOMER);
      
      // Verify customer profile was created
      const customer = await Customer.findOne({ userId: savedUser._id });
      expect(customer).toBeTruthy();
      expect(customer.loyaltyPoints).toBe(0);
      
      //
      // Step 2: Login with the registered user
      //
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data.user).toBeDefined();
      expect(loginResponse.body.data.token).toBeDefined();
      expect(loginResponse.body.data.refreshToken).toBeDefined();
      
      const accessToken = loginResponse.body.data.token;
      const refreshToken = loginResponse.body.data.refreshToken;
      
      //
      // Step 3: Get user profile with access token
      //
      const profileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`);
      
      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body.success).toBe(true);
      expect(profileResponse.body.data._id).toBe(userId);
      expect(profileResponse.body.data.email).toBe(testUser.email);
      expect(profileResponse.body.data.profile).toBeDefined(); // Should include customer profile
      
      //
      // Step 4: Update user profile with access token
      //
      const updateProfileData = {
        firstName: 'Updated',
        lastName: 'Name',
        profile: {
          phone: '+1234567890',
          address: {
            street: '123 Bike St',
            city: 'Bikeville',
            state: 'Bikestate',
            postalCode: '12345',
            country: 'Bikeland',
          },
          preferences: {
            bikeTypes: ['road', 'city'],
            bikeSize: 'M',
            notificationPreferences: {
              email: true,
              sms: true,
            },
          },
        },
      };
      
      const updateProfileResponse = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateProfileData);
      
      expect(updateProfileResponse.status).toBe(200);
      expect(updateProfileResponse.body.success).toBe(true);
      expect(updateProfileResponse.body.data.firstName).toBe(updateProfileData.firstName);
      expect(updateProfileResponse.body.data.lastName).toBe(updateProfileData.lastName);
      expect(updateProfileResponse.body.data.profile.phone).toBe(updateProfileData.profile.phone);
      expect(updateProfileResponse.body.data.profile.address.city).toBe(updateProfileData.profile.address.city);
      expect(updateProfileResponse.body.data.profile.preferences.bikeSize).toBe(updateProfileData.profile.preferences.bikeSize);
      
      // Verify updates persisted to database
      const updatedUser = await User.findById(userId);
      expect(updatedUser.firstName).toBe(updateProfileData.firstName);
      expect(updatedUser.lastName).toBe(updateProfileData.lastName);
      
      const updatedCustomer = await Customer.findOne({ userId });
      expect(updatedCustomer.phone).toBe(updateProfileData.profile.phone);
      expect(updatedCustomer.address.city).toBe(updateProfileData.profile.address.city);
      
      //
      // Step 5: Refresh token to get a new access token
      //
      const refreshTokenResponse = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });
      
      expect(refreshTokenResponse.status).toBe(200);
      expect(refreshTokenResponse.body.success).toBe(true);
      expect(refreshTokenResponse.body.data.token).toBeDefined();
      expect(refreshTokenResponse.body.data.newRefreshToken).toBeDefined();
      
      const newAccessToken = refreshTokenResponse.body.data.token;
      const newRefreshToken = refreshTokenResponse.body.data.newRefreshToken;
      
      // Old token should still work briefly (until expiry)
      const oldTokenProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`);
      
      expect(oldTokenProfileResponse.status).toBe(200);
      
      // New token should work too
      const newTokenProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${newAccessToken}`);
      
      expect(newTokenProfileResponse.status).toBe(200);
      expect(newTokenProfileResponse.body.data._id).toBe(userId);
      
      // Old refresh token should be invalidated
      const oldRefreshResponse = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });
      
      expect(oldRefreshResponse.status).toBe(401);
      expect(oldRefreshResponse.body.success).toBe(false);
      
      //
      // Step 6: Change password with current access token
      //
      const newPassword = 'NewPassword123!';
      
      const changePasswordResponse = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword,
          confirmPassword: newPassword,
        });
      
      expect(changePasswordResponse.status).toBe(200);
      expect(changePasswordResponse.body.success).toBe(true);
      
      // Try logging in with old password (should fail)
      const oldPasswordLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      
      expect(oldPasswordLoginResponse.status).toBe(401);
      expect(oldPasswordLoginResponse.body.success).toBe(false);
      
      // Login with new password (should succeed)
      const newPasswordLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        });
      
      expect(newPasswordLoginResponse.status).toBe(200);
      expect(newPasswordLoginResponse.body.success).toBe(true);
      expect(newPasswordLoginResponse.body.data.token).toBeDefined();
      
      const finalToken = newPasswordLoginResponse.body.data.token;
      const finalRefreshToken = newPasswordLoginResponse.body.data.refreshToken;
      
      //
      // Step 7: Verify profile access with final token
      //
      const finalProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${finalToken}`);
      
      expect(finalProfileResponse.status).toBe(200);
      expect(finalProfileResponse.body.success).toBe(true);
      expect(finalProfileResponse.body.data._id).toBe(userId);
      
      //
      // Step 8: Logout and invalidate refresh token
      //
      const logoutResponse = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken: finalRefreshToken });
      
      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body.success).toBe(true);
      
      // Verify refresh token is invalidated
      const postLogoutRefreshResponse = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: finalRefreshToken });
      
      expect(postLogoutRefreshResponse.status).toBe(401);
      expect(postLogoutRefreshResponse.body.success).toBe(false);
      
      // Access token should still work until it expires
      // (We can't properly test expiry in this context without time manipulation)
      const postLogoutProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${finalToken}`);
      
      expect(postLogoutProfileResponse.status).toBe(200);
    });
  });
  
  describe('Registration Validation', () => {
    test('should validate email format during registration', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: testUser.password,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should validate password strength during registration', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testUser.email,
          password: 'weak',
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    test('should prevent duplicate email registrations', async () => {
      // First register a user
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testUser.email,
          password: testUser.password,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        });
      
      // Try to register with the same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testUser.email,
          password: 'DifferentPassword123!',
          firstName: 'Different',
          lastName: 'User',
        });
      
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('Forgot Password Flow', () => {
    let userId: string;
    let resetToken: string;
    
    beforeEach(async () => {
      // Create a test user for password reset
      const user = new User({
        email: testUser.email,
        password: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: UserRole.CUSTOMER,
      });
      await user.save();
      userId = user._id.toString();
      
      // In a real app, the reset token would be sent via email
      // For testing, we'll create and store a reset token directly
      resetToken = 'test-reset-token-12345';
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
      await user.save();
    });
    
    test('should handle forgot password request', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: testUser.email });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify that a new reset token was generated (though we can't access it directly from the API)
      const updatedUser = await User.findById(userId);
      expect(updatedUser.resetPasswordToken).toBeDefined();
      expect(updatedUser.resetPasswordExpires).toBeDefined();
      // The token should be different from our test token
      expect(updatedUser.resetPasswordToken).not.toBe(resetToken);
    });
    
    test('should not reveal user existence for non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });
      
      // Should still return 200 to prevent user enumeration
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    test('should reset password with valid token', async () => {
      // In a real app, this would use the reset token from the email
      // For testing, we'll use the token we stored directly
      const newPassword = 'NewResetPassword123!';
      
      const response = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token: resetToken,
          newPassword,
          confirmPassword: newPassword,
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify reset token was cleared
      const updatedUser = await User.findById(userId);
      expect(updatedUser.resetPasswordToken).toBeUndefined();
      expect(updatedUser.resetPasswordExpires).toBeUndefined();
      
      // Verify login works with new password
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        });
      
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
    });
    
    test('should reject invalid reset tokens', async () => {
      const response = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('Role-Based Access Control', () => {
    let customerToken: string;
    let staffToken: string;
    let adminToken: string;
    
    beforeEach(async () => {
      // Create users with different roles
      const customer = new User({
        email: 'customer@example.com',
        password: 'Password123!',
        firstName: 'Customer',
        lastName: 'User',
        role: UserRole.CUSTOMER,
      });
      await customer.save();
      
      const staff = new User({
        email: 'staff@example.com',
        password: 'Password123!',
        firstName: 'Staff',
        lastName: 'User',
        role: UserRole.STAFF,
      });
      await staff.save();
      
      const admin = new User({
        email: 'admin@example.com',
        password: 'Password123!',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      });
      await admin.save();
      
      // Login with each user to get tokens
      const customerLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'customer@example.com',
          password: 'Password123!',
        });
      customerToken = customerLogin.body.data.token;
      
      const staffLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'staff@example.com',
          password: 'Password123!',
        });
      staffToken = staffLogin.body.data.token;
      
      const adminLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Password123!',
        });
      adminToken = adminLogin.body.data.token;
    });
    
    test('should enforce role-based access to admin endpoints', async () => {
      // Try to access admin-only endpoint with each role
      const customerResponse = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(customerResponse.status).toBe(403);
      expect(customerResponse.body.success).toBe(false);
      
      const staffResponse = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${staffToken}`);
      
      expect(staffResponse.status).toBe(403);
      expect(staffResponse.body.success).toBe(false);
      
      const adminResponse = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(adminResponse.status).toBe(200);
      expect(adminResponse.body.success).toBe(true);
      expect(Array.isArray(adminResponse.body.data)).toBe(true);
    });
    
    test('should enforce role-based access to staff endpoints', async () => {
      // Try to access staff-only endpoint with each role
      const customerResponse = await request(app)
        .get('/api/v1/staff/dashboard')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(customerResponse.status).toBe(403);
      expect(customerResponse.body.success).toBe(false);
      
      const staffResponse = await request(app)
        .get('/api/v1/staff/dashboard')
        .set('Authorization', `Bearer ${staffToken}`);
      
      expect(staffResponse.status).toBe(200);
      expect(staffResponse.body.success).toBe(true);
      
      const adminResponse = await request(app)
        .get('/api/v1/staff/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(adminResponse.status).toBe(200);
      expect(adminResponse.body.success).toBe(true);
    });
  });
});