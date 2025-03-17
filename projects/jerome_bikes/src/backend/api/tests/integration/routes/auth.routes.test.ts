/**
 * Authentication Routes Integration Tests
 */
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from '../../../routes/v1/auth.routes';
import { AuthService } from '../../../services/auth.service';
import { ApiError } from '../../../utils/api-error';
import { UserRole } from '../../../../../shared/types/models';

// Mock dependencies
jest.mock('../../../services/auth.service');

describe('Auth Routes', () => {
  let app: express.Application;
  let mockAuthService: jest.Mocked<AuthService>;
  
  beforeEach(() => {
    // Set up Express app for testing
    app = express();
    app.use(bodyParser.json());
    app.use(cookieParser());
    
    // Create fresh mocked service for each test
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;
    
    // Override the authService instance in the AuthController with our mock
    // This is a bit hacky, but necessary for integration testing routes
    const originalAuthRoutes = require('../../../routes/v1/auth.routes').default;
    const authController = originalAuthRoutes.stack
      .find((layer: any) => layer.route && layer.route.path === '/register')
      ?.route.stack[1].handle.controller;
    
    if (authController) {
      authController.authService = mockAuthService;
    }
    
    // Mount routes
    app.use('/api/v1/auth', authRoutes);
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  describe('POST /register', () => {
    it('should register a new user', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const mockUser = {
        _id: 'user-id',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: UserRole.CUSTOMER,
      };
      
      const mockToken = 'mock-jwt-token';
      
      mockAuthService.registerUser = jest.fn().mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);
      
      // Assert
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(userData);
      expect(response.body).toEqual({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });
    });
    
    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidUserData = {
        email: 'invalid-email',
        password: 'short',
        firstName: '',
        lastName: 'User',
      };
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(invalidUserData)
        .expect(400);
      
      // Assert
      expect(mockAuthService.registerUser).not.toHaveBeenCalled();
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    it('should return 409 if user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };
      
      mockAuthService.registerUser = jest.fn().mockRejectedValue(
        ApiError.conflict('User with this email already exists')
      );
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409);
      
      // Assert
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(userData);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'User with this email already exists',
          code: 409,
        },
      });
    });
  });
  
  describe('POST /login', () => {
    it('should log in a user successfully', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      
      const mockUser = {
        _id: 'user-id',
        email: loginData.email,
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.CUSTOMER,
      };
      
      const mockToken = 'mock-jwt-token';
      const mockRefreshToken = 'mock-refresh-token';
      
      mockAuthService.loginUser = jest.fn().mockResolvedValue({
        user: mockUser,
        token: mockToken,
        refreshToken: mockRefreshToken,
      });
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);
      
      // Assert
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(
        loginData.email,
        loginData.password
      );
      
      expect(response.body).toEqual({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });
      
      // Check for refresh token cookie
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('refreshToken');
    });
    
    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidLoginData = {
        email: 'invalid-email',
        password: '',
      };
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(invalidLoginData)
        .expect(400);
      
      // Assert
      expect(mockAuthService.loginUser).not.toHaveBeenCalled();
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
    
    it('should return 401 for invalid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };
      
      mockAuthService.loginUser = jest.fn().mockRejectedValue(
        ApiError.unauthorized('Invalid email or password')
      );
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);
      
      // Assert
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(
        loginData.email,
        loginData.password
      );
      
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 401,
        },
      });
    });
  });
  
  describe('POST /logout', () => {
    it('should log out a user successfully', async () => {
      // Arrange
      mockAuthService.invalidateRefreshToken = jest.fn().mockResolvedValue(undefined);
      
      // Act
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', ['refreshToken=mock-refresh-token'])
        .expect(200);
      
      // Assert
      expect(mockAuthService.invalidateRefreshToken).toHaveBeenCalledWith('mock-refresh-token');
      expect(response.body).toEqual({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      });
      
      // Check for cleared refresh token cookie
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('refreshToken=;');
    });
    
    it('should return 200 even without a refresh token', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(200);
      
      // Assert
      expect(mockAuthService.invalidateRefreshToken).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      });
    });
  });
});