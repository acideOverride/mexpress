/**
 * Authentication Service Unit Tests
 */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthService } from '../../../services/auth.service';
import User from '../../../../models/user.model';
import Customer from '../../../../models/customer.model';
import { ApiError } from '../../../utils/api-error';
import { UserRole } from '../../../../../shared/types/models';
import { env } from '../../../../../shared/config/env';

// Mock dependencies
jest.mock('../../../../models/user.model');
jest.mock('../../../../models/customer.model');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../../../../shared/config/env', () => ({
  env: 'test',
  jwt: {
    secret: 'test-secret',
    expiresIn: '1h',
    refreshSecret: 'test-refresh-secret',
    refreshExpiresIn: 604800, // 7 days
  },
}));

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    // Create fresh service for each test
    authService = new AuthService();
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const mockUserId = new mongoose.Types.ObjectId();
      
      const mockUser = {
        _id: mockUserId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: UserRole.CUSTOMER,
        toObject: jest.fn().mockReturnValue({
          _id: mockUserId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: UserRole.CUSTOMER,
          password: 'hashed-password',
        }),
        save: jest.fn().mockResolvedValue(undefined),
      };
      
      const mockToken = 'mock-jwt-token';
      
      // Mock findOne to return null (user doesn't exist)
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      // Mock User constructor
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);
      
      // Mock Customer constructor
      (Customer as unknown as jest.Mock).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(undefined),
      }));
      
      // Mock JWT sign
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      
      // Act
      const result = await authService.registerUser(userData);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(User).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: UserRole.CUSTOMER,
        isActive: true,
      });
      expect(mockUser.save).toHaveBeenCalled();
      expect(Customer).toHaveBeenCalledWith({
        userId: mockUserId,
        phone: '',
        loyaltyPoints: 0,
        memberSince: expect.any(Date),
        rentalHistory: [],
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUserId, email: userData.email, role: UserRole.CUSTOMER },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
      );
      expect(result).toEqual({
        user: {
          _id: mockUserId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: UserRole.CUSTOMER,
        },
        token: mockToken,
      });
    });
    
    it('should throw if user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };
      
      // Mock findOne to return an existing user
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'existing-user-id',
        email: userData.email,
      });
      
      // Act & Assert
      await expect(authService.registerUser(userData)).rejects.toThrow(
        new ApiError('User with this email already exists', 409)
      );
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    });
  });
  
  describe('loginUser', () => {
    it('should login a user successfully', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'Password123!';
      const mockUserId = new mongoose.Types.ObjectId();
      
      const mockUser = {
        _id: mockUserId,
        email,
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.CUSTOMER,
        isActive: true,
        lastLogin: null,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(undefined),
        toObject: jest.fn().mockReturnValue({
          _id: mockUserId,
          email,
          firstName: 'Test',
          lastName: 'User',
          role: UserRole.CUSTOMER,
          isActive: true,
          password: 'hashed-password',
        }),
      };
      
      const mockToken = 'mock-jwt-token';
      const mockRefreshToken = 'mock-refresh-token';
      
      // Mock findOne to return a user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      
      // Mock JWT sign
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(mockRefreshToken);
      
      // Act
      const result = await authService.loginUser(email, password);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
      expect(mockUser.save).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        user: {
          _id: mockUserId,
          email,
          firstName: 'Test',
          lastName: 'User',
          role: UserRole.CUSTOMER,
          isActive: true,
        },
        token: mockToken,
        refreshToken: mockRefreshToken,
      });
    });
    
    it('should throw if user not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'Password123!';
      
      // Mock findOne to return null
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      // Act & Assert
      await expect(authService.loginUser(email, password)).rejects.toThrow(
        new ApiError('Invalid email or password', 401)
      );
      expect(User.findOne).toHaveBeenCalledWith({ email });
    });
    
    it('should throw if account is inactive', async () => {
      // Arrange
      const email = 'inactive@example.com';
      const password = 'Password123!';
      
      // Mock findOne to return an inactive user
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'user-id',
        email,
        isActive: false,
      });
      
      // Act & Assert
      await expect(authService.loginUser(email, password)).rejects.toThrow(
        new ApiError('Account is inactive', 403)
      );
      expect(User.findOne).toHaveBeenCalledWith({ email });
    });
    
    it('should throw if password is incorrect', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'WrongPassword123!';
      
      const mockUser = {
        _id: 'user-id',
        email,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      
      // Mock findOne to return a user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      
      // Act & Assert
      await expect(authService.loginUser(email, password)).rejects.toThrow(
        new ApiError('Invalid email or password', 401)
      );
      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
    });
  });
  
  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const mockUserId = new mongoose.Types.ObjectId();
      
      const mockUser = {
        _id: mockUserId,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.CUSTOMER,
        isActive: true,
        toObject: jest.fn().mockReturnValue({
          _id: mockUserId,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: UserRole.CUSTOMER,
          isActive: true,
        }),
      };
      
      const mockToken = 'new-jwt-token';
      const mockNewRefreshToken = 'new-refresh-token';
      
      // Mock JWT verify
      (jwt.verify as jest.Mock).mockReturnValue({
        id: mockUserId,
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
      });
      
      // Mock findById to return a user
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      
      // Mock JWT sign
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(mockNewRefreshToken);
      
      // Act
      const result = await authService.refreshToken(refreshToken);
      
      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, env.jwt.refreshSecret);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        token: mockToken,
        user: {
          _id: mockUserId,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: UserRole.CUSTOMER,
          isActive: true,
        },
        newRefreshToken: mockNewRefreshToken,
      });
    });
    
    it('should throw if JWT verification fails', async () => {
      // Arrange
      const refreshToken = 'invalid-refresh-token';
      
      // Mock JWT verify to throw
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      // Act & Assert
      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        new ApiError('Invalid or expired refresh token', 401)
      );
      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, env.jwt.refreshSecret);
      expect(User.findById).not.toHaveBeenCalled();
    });
    
    it('should throw if user not found or inactive', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const mockUserId = new mongoose.Types.ObjectId();
      
      // Mock JWT verify
      (jwt.verify as jest.Mock).mockReturnValue({
        id: mockUserId,
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
      });
      
      // Mock findById to return null
      (User.findById as jest.Mock).mockResolvedValue(null);
      
      // Act & Assert
      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        new ApiError('User not found or inactive', 401)
      );
      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, env.jwt.refreshSecret);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
    });
  });
  
  describe('changePassword', () => {
    it('should change password successfully', async () => {
      // Arrange
      const userId = 'user-id';
      const currentPassword = 'CurrentPassword123!';
      const newPassword = 'NewPassword123!';
      
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(undefined),
      };
      
      // Mock findById to return a user
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      
      // Act
      const result = await authService.changePassword(userId, currentPassword, newPassword);
      
      // Assert
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(currentPassword);
      expect(mockUser.password).toBe(newPassword);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
    
    it('should throw if user not found', async () => {
      // Arrange
      const userId = 'nonexistent-user-id';
      const currentPassword = 'CurrentPassword123!';
      const newPassword = 'NewPassword123!';
      
      // Mock findById to return null
      (User.findById as jest.Mock).mockResolvedValue(null);
      
      // Act & Assert
      await expect(
        authService.changePassword(userId, currentPassword, newPassword)
      ).rejects.toThrow(new ApiError('User not found', 404));
      expect(User.findById).toHaveBeenCalledWith(userId);
    });
    
    it('should throw if current password is incorrect', async () => {
      // Arrange
      const userId = 'user-id';
      const currentPassword = 'WrongPassword123!';
      const newPassword = 'NewPassword123!';
      
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      
      // Mock findById to return a user
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      
      // Act & Assert
      await expect(
        authService.changePassword(userId, currentPassword, newPassword)
      ).rejects.toThrow(new ApiError('Current password is incorrect', 400));
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(currentPassword);
    });
  });
});