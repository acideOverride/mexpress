/**
 * Authentication Middleware
 * Handles JWT verification and user authentication
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';
import { env } from '../../../shared/config/env';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

/**
 * Verify JWT token from Authorization header
 * Attaches user data to request if token is valid
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Authentication token missing');
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, env.jwt.secret);
      
      // Attach user data and token to request
      req.user = decoded;
      req.token = token;
      
      next();
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired token');
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          message: error.message,
          code: error.statusCode,
        },
      });
    }
    next(error);
  }
};

/**
 * Authorize based on user role
 * @param roles Allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('User not authenticated');
      }

      if (!roles.includes(req.user.role)) {
        throw ApiError.forbidden('Insufficient permissions');
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            message: error.message,
            code: error.statusCode,
          },
        });
      }
      next(error);
    }
  };
};