/**
 * CSRF Protection Middleware
 * Provides Cross-Site Request Forgery protection for API endpoints
 */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { randomBytes } from 'crypto';
import { ApiError } from '../utils/api-error';
import { env } from '../../../shared/config/env';

// Store for CSRF tokens
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Clean expired tokens every hour
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expires < now) {
      csrfTokens.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

/**
 * Generate a CSRF token and store it for validation
 * @param req Express request
 * @param res Express response
 * @param next Next function
 */
export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Generate a random token
    const token = randomBytes(32).toString('hex');
    
    // Get session ID or use IP + user agent as fallback
    const sessionId = req.sessionID || `${req.ip}-${req.headers['user-agent']}`;
    
    // Store token with expiration (24 hours)
    const expires = Date.now() + 24 * 60 * 60 * 1000;
    csrfTokens.set(sessionId, { token, expires });
    
    // Add token to response headers
    res.setHeader('X-CSRF-Token', token);
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validate CSRF token on state-changing requests
 * @param req Express request
 * @param res Express response
 * @param next Next function
 */
export const validateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF validation in test environment
  if (env.isTest) {
    return next();
  }
  
  // Only validate token for state-changing methods
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }
  
  try {
    // Get token from header or request body
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    
    if (!token) {
      throw ApiError.forbidden('CSRF token missing');
    }
    
    // Get session ID or use IP + user agent as fallback
    const sessionId = req.sessionID || `${req.ip}-${req.headers['user-agent']}`;
    
    // Get stored token
    const storedToken = csrfTokens.get(sessionId);
    
    if (!storedToken) {
      throw ApiError.forbidden('CSRF token not found');
    }
    
    if (storedToken.expires < Date.now()) {
      csrfTokens.delete(sessionId);
      throw ApiError.forbidden('CSRF token expired');
    }
    
    if (token !== storedToken.token) {
      throw ApiError.forbidden('Invalid CSRF token');
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