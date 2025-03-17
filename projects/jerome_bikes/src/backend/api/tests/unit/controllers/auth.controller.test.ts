/**
 * Authentication Controller Unit Tests
 */
import { Request, Response } from 'express';
import { AuthController } from '../../../controllers/auth.controller';
import { AuthService } from '../../../services/auth.service';
import { ApiError } from '../../../utils/api-error';
import { StatusCodes } from 'http-status-codes';

// Mock dependencies
jest.mock('../../../services/auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAuthService: jest.Mocked<AuthService>;
  
  beforeEach(() => {
    // Create fresh mocks for each test
    mockRequest = {
      body: {},
      user: { id: 'user-id' },
      cookies: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    
    // Reset mocked service
    jest.clearAllMocks();
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;
    
    // Create controller with mocked service
    authController = new AuthController();
    (authController as any).authService = mockAuthService;
  });
  
  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const registerData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };
      
      mockRequest.body = registerData;
      
      const mockUser = {
        _id: 'user-id',
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: 'customer',
      };
      
      const mockToken = 'mock-jwt-token';
      
      mockAuthService.registerUser = jest.fn().mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });
      
      // Act
      await authController.register(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(registerData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });
    });
    
    it('should handle registration errors', async () => {
      // Arrange
      mockRequest.body = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };
      
      mockAuthService.registerUser = jest.fn().mockRejectedValue(
        ApiError.conflict('User with this email already exists')
      );
      
      // Act
      await authController.register(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'User with this email already exists',
          code: StatusCodes.CONFLICT,
        },
      });
    });
  });
  
  describe('login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      mockRequest.body = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'customer',
      };
      
      const mockToken = 'mock-jwt-token';
      const mockRefreshToken = 'mock-refresh-token';
      
      mockAuthService.loginUser = jest.fn().mockResolvedValue({
        user: mockUser,
        token: mockToken,
        refreshToken: mockRefreshToken,
      });
      
      // Act
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(
        mockRequest.body.email,
        mockRequest.body.password
      );
      
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockRefreshToken,
        expect.any(Object)
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      });
    });
    
    it('should handle login errors', async () => {
      // Arrange
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrong-password',
      };
      
      mockAuthService.loginUser = jest.fn().mockRejectedValue(
        ApiError.unauthorized('Invalid email or password')
      );
      
      // Act
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(
        mockRequest.body.email,
        mockRequest.body.password
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: StatusCodes.UNAUTHORIZED,
        },
      });
    });
  });
  
  describe('logout', () => {
    it('should log out a user successfully', async () => {
      // Arrange
      mockRequest.cookies = { refreshToken: 'mock-refresh-token' };
      mockAuthService.invalidateRefreshToken = jest.fn().mockResolvedValue(undefined);
      
      // Act
      await authController.logout(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.invalidateRefreshToken).toHaveBeenCalledWith('mock-refresh-token');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', expect.any(Object));
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    });
  });
  
  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Arrange
      mockRequest.cookies = { refreshToken: 'mock-refresh-token' };
      
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'customer',
      };
      
      const mockToken = 'new-jwt-token';
      const mockNewRefreshToken = 'new-refresh-token';
      
      mockAuthService.refreshToken = jest.fn().mockResolvedValue({
        token: mockToken,
        user: mockUser,
        newRefreshToken: mockNewRefreshToken,
      });
      
      // Act
      await authController.refreshToken(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith('mock-refresh-token');
      
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockNewRefreshToken,
        expect.any(Object)
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          token: mockToken,
          user: mockUser,
        },
      });
    });
    
    it('should handle missing refresh token', async () => {
      // Arrange
      mockRequest.cookies = {};
      mockRequest.body = {};
      
      // Act
      await authController.refreshToken(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.refreshToken).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Refresh token is required',
          code: StatusCodes.UNAUTHORIZED,
        },
      });
    });
  });
  
  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      // Arrange
      mockRequest.user = { id: 'user-id' };
      
      const mockProfile = {
        _id: 'user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'customer',
        profile: {
          phone: '+1234567890',
          memberSince: new Date(),
        },
      };
      
      mockAuthService.getUserProfile = jest.fn().mockResolvedValue(mockProfile);
      
      // Act
      await authController.getProfile(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.getUserProfile).toHaveBeenCalledWith('user-id');
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { user: mockProfile },
      });
    });
    
    it('should handle unauthenticated user', async () => {
      // Arrange
      mockRequest.user = undefined;
      
      // Act
      await authController.getProfile(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockAuthService.getUserProfile).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'User not authenticated',
          code: StatusCodes.UNAUTHORIZED,
        },
      });
    });
  });
});