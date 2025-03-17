/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */
import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { AuthService } from '../services/auth.service';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';
import jwt from 'jsonwebtoken';
import { env } from '../../../shared/config/env';
import logger from '../utils/logger';

export class AuthController extends BaseController {
  private authService: AuthService;
  
  constructor() {
    super();
    this.authService = new AuthService();
  }
  
  /**
   * Register a new user
   * @route POST /api/v1/auth/register
   */
  register = this.asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body;
    const { user, token } = await this.authService.registerUser(userData);
    return this.sendSuccess(res, { user, token }, StatusCodes.CREATED);
  });
  
  /**
   * Login user
   * @route POST /api/v1/auth/login
   */
  login = this.asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await this.authService.loginUser(email, password);
    
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.env === 'production',
      maxAge: env.jwt.refreshExpiresIn * 1000, // convert to milliseconds
      sameSite: 'strict',
      path: '/api/v1/auth/refresh-token',
    });
    
    return this.sendSuccess(res, { user, token });
  });
  
  /**
   * Refresh access token
   * @route POST /api/v1/auth/refresh-token
   */
  refreshToken = this.asyncHandler(async (req: Request, res: Response) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }
    
    const { token, user, newRefreshToken } = await this.authService.refreshToken(refreshToken);
    
    // Set new refresh token as HttpOnly cookie
    if (newRefreshToken) {
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: env.env === 'production',
        maxAge: env.jwt.refreshExpiresIn * 1000, // convert to milliseconds
        sameSite: 'strict',
        path: '/api/v1/auth/refresh-token',
      });
    }
    
    return this.sendSuccess(res, { token, user });
  });
  
  /**
   * Logout user
   * @route POST /api/v1/auth/logout
   */
  logout = this.asyncHandler(async (req: Request, res: Response) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (refreshToken) {
      // Invalidate the refresh token
      await this.authService.invalidateRefreshToken(refreshToken);
    }
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.env === 'production',
      path: '/api/v1/auth/refresh-token',
    });
    
    return this.sendSuccess(res, { message: 'Logged out successfully' });
  });
  
  /**
   * Request password reset
   * @route POST /api/v1/auth/forgot-password
   */
  forgotPassword = this.asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.requestPasswordReset(email);
    return this.sendSuccess(res, { message: 'Password reset instructions sent to your email' });
  });
  
  /**
   * Reset password
   * @route POST /api/v1/auth/reset-password
   */
  resetPassword = this.asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await this.authService.resetPassword(token, newPassword);
    return this.sendSuccess(res, { message: 'Password reset successful' });
  });
  
  /**
   * Change password
   * @route POST /api/v1/auth/change-password
   */
  changePassword = this.asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      throw ApiError.unauthorized('User not authenticated');
    }
    
    await this.authService.changePassword(userId, currentPassword, newPassword);
    return this.sendSuccess(res, { message: 'Password changed successfully' });
  });

  /**
   * Get current user profile
   * @route GET /api/v1/auth/profile
   */
  getProfile = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    
    if (!userId) {
      throw ApiError.unauthorized('User not authenticated');
    }
    
    const user = await this.authService.getUserProfile(userId);
    return this.sendSuccess(res, { user });
  });
  
  /**
   * Update user profile
   * @route PUT /api/v1/auth/profile
   */
  updateProfile = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    
    if (!userId) {
      throw ApiError.unauthorized('User not authenticated');
    }
    
    const updateData = req.body;
    const user = await this.authService.updateUserProfile(userId, updateData);
    return this.sendSuccess(res, { user });
  });
}