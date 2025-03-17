/**
 * Authentication Service
 * Handles business logic for authentication operations
 */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../../models/user.model';
import Customer from '../../models/customer.model';
import { IUser, UserRole } from '../../../shared/types/models';
import { ApiError } from '../utils/api-error';
import { StatusCodes } from 'http-status-codes';
import { env } from '../../../shared/config/env';
import logger from '../utils/logger';

// Interface for token payload
interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

// Interface for refresh token
interface RefreshToken {
  token: string;
  userId: string;
  expires: Date;
  blacklisted: boolean;
}

// In-memory token blacklist (should be replaced with Redis in production)
const tokenBlacklist = new Set<string>();

export class AuthService {
  /**
   * Register a new user
   * @param userData User registration data
   * @returns Registered user and token
   */
  async registerUser(userData: Partial<IUser>) {
    try {
      // Check if user with email already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        throw ApiError.conflict('User with this email already exists');
      }
      
      // Create user
      const user = new User({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || UserRole.CUSTOMER,
        isActive: true,
      });
      
      await user.save();
      
      // If user is a customer, create customer profile
      if (user.role === UserRole.CUSTOMER) {
        const customer = new Customer({
          userId: user._id,
          phone: userData.phone || '',
          loyaltyPoints: 0,
          memberSince: new Date(),
          rentalHistory: [],
        });
        
        await customer.save();
      }
      
      // Generate token
      const token = this.generateToken(user);
      
      // Remove password from response
      const userObject = user.toObject();
      delete userObject.password;
      
      logger.info(`User registered: ${user._id} (${user.email})`);
      return { user: userObject, token };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('User validation failed', error.errors);
      }
      
      logger.error(`Error registering user: ${error.message}`);
      throw ApiError.internal('Error registering user');
    }
  }
  
  /**
   * Login a user
   * @param email User email
   * @param password User password
   * @returns Logged in user, token, and refresh token
   */
  async loginUser(email: string, password: string) {
    try {
      // Find user
      const user = await User.findOne({ email });
      
      if (!user) {
        throw ApiError.unauthorized('Invalid email or password');
      }
      
      // Check if account is active
      if (!user.isActive) {
        throw ApiError.forbidden('Account is inactive');
      }
      
      // Verify password
      const passwordMatch = await user.comparePassword(password);
      
      if (!passwordMatch) {
        throw ApiError.unauthorized('Invalid email or password');
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);
      
      // Remove password from response
      const userObject = user.toObject();
      delete userObject.password;
      
      logger.info(`User logged in: ${user._id} (${user.email})`);
      return { user: userObject, token, refreshToken };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error during login: ${error.message}`);
      throw ApiError.internal('Error during login');
    }
  }
  
  /**
   * Refresh access token
   * @param refreshToken Refresh token
   * @returns New access token and user
   */
  async refreshToken(refreshToken: string) {
    try {
      // Check if token is blacklisted
      if (tokenBlacklist.has(refreshToken)) {
        throw ApiError.unauthorized('Invalid refresh token');
      }
      
      // Verify refresh token
      let decoded: any;
      try {
        decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);
      } catch (error) {
        throw ApiError.unauthorized('Invalid or expired refresh token');
      }
      
      // Get user
      const user = await User.findById(decoded.id);
      
      if (!user || !user.isActive) {
        throw ApiError.unauthorized('User not found or inactive');
      }
      
      // Generate new tokens
      const token = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      
      // Blacklist old refresh token
      tokenBlacklist.add(refreshToken);
      
      // Remove password from response
      const userObject = user.toObject();
      delete userObject.password;
      
      return { token, user: userObject, newRefreshToken };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error refreshing token: ${error.message}`);
      throw ApiError.internal('Error refreshing token');
    }
  }
  
  /**
   * Invalidate refresh token
   * @param refreshToken Refresh token to invalidate
   */
  async invalidateRefreshToken(refreshToken: string) {
    tokenBlacklist.add(refreshToken);
  }
  
  /**
   * Request password reset
   * @param email User email
   * @returns Password reset token
   */
  async requestPasswordReset(email: string) {
    try {
      // Find user
      const user = await User.findOne({ email });
      
      if (!user) {
        // Don't reveal user existence, just return success
        return { success: true };
      }
      
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(resetToken, 10);
      
      // Store reset token (in a real implementation, this would be stored in DB)
      // For demo, we'll just log it
      logger.info(`Password reset token for ${email}: ${resetToken}`);
      
      // In a real implementation, send email with reset link
      // const resetLink = `${env.frontendUrl}/reset-password?token=${resetToken}`;
      // await sendEmail(email, 'Password Reset', `Click here to reset your password: ${resetLink}`);
      
      return { success: true };
    } catch (error) {
      logger.error(`Error requesting password reset: ${error.message}`);
      throw ApiError.internal('Error requesting password reset');
    }
  }
  
  /**
   * Reset password
   * @param token Reset token
   * @param newPassword New password
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      // In a real implementation, find user by reset token
      // For demo, we'll throw an error
      throw ApiError.badRequest('Reset token verification not implemented');
      
      // Update password
      // user.password = newPassword;
      // await user.save();
      
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error resetting password: ${error.message}`);
      throw ApiError.internal('Error resetting password');
    }
  }
  
  /**
   * Change user password
   * @param userId User ID
   * @param currentPassword Current password
   * @param newPassword New password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      // Find user
      const user = await User.findById(userId);
      
      if (!user) {
        throw ApiError.notFound('User not found');
      }
      
      // Verify current password
      const passwordMatch = await user.comparePassword(currentPassword);
      
      if (!passwordMatch) {
        throw ApiError.badRequest('Current password is incorrect');
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      logger.info(`Password changed for user: ${user._id}`);
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error changing password: ${error.message}`);
      throw ApiError.internal('Error changing password');
    }
  }
  
  /**
   * Get user profile
   * @param userId User ID
   * @returns User profile
   */
  async getUserProfile(userId: string) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw ApiError.notFound('User not found');
      }
      
      // Get additional profile data
      let profileData = {};
      
      if (user.role === UserRole.CUSTOMER) {
        const customer = await Customer.findOne({ userId: user._id });
        if (customer) {
          profileData = customer.toObject();
        }
      }
      
      // Remove password from response
      const userObject = user.toObject();
      delete userObject.password;
      
      return { ...userObject, profile: profileData };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Error getting user profile: ${error.message}`);
      throw ApiError.internal('Error getting user profile');
    }
  }
  
  /**
   * Update user profile
   * @param userId User ID
   * @param updateData Profile update data
   * @returns Updated user profile
   */
  async updateUserProfile(userId: string, updateData: any) {
    try {
      // Ensure email and password can't be updated this way
      if (updateData.email) delete updateData.email;
      if (updateData.password) delete updateData.password;
      if (updateData.role) delete updateData.role;
      
      // Update user
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { firstName: updateData.firstName, lastName: updateData.lastName } },
        { new: true, runValidators: true }
      );
      
      if (!user) {
        throw ApiError.notFound('User not found');
      }
      
      // Update customer profile if user is a customer
      if (user.role === UserRole.CUSTOMER && updateData.profile) {
        await Customer.findOneAndUpdate(
          { userId: user._id },
          { $set: updateData.profile },
          { new: true, runValidators: true }
        );
      }
      
      // Get updated profile
      return this.getUserProfile(userId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw ApiError.validation('Profile validation failed', error.errors);
      }
      
      logger.error(`Error updating user profile: ${error.message}`);
      throw ApiError.internal('Error updating user profile');
    }
  }
  
  /**
   * Generate JWT token
   * @param user User document
   * @returns JWT token
   */
  private generateToken(user: any): string {
    const payload: TokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
    });
  }
  
  /**
   * Generate refresh token
   * @param user User document
   * @returns Refresh token
   */
  private generateRefreshToken(user: any): string {
    const payload: TokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    
    return jwt.sign(payload, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiresIn,
    });
  }
}