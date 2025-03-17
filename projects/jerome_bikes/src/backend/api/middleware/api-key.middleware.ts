/**
 * API Key Validation Middleware
 * Provides API key-based authentication for external services
 */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';
import { env } from '../../../shared/config/env';
import logger from '../utils/logger';

// Interface for API key permissions
interface ApiKeyPermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
  endpoints: string[];
}

// Map of valid API keys and their permissions
// In a real system, this would be stored in a database
const API_KEYS = new Map<string, ApiKeyPermissions>([
  // System API key (full access)
  [env.apiKeys?.system || 'system-api-key-placeholder', {
    read: true,
    write: true,
    delete: true,
    endpoints: ['*'],
  }],
  // Analytics API key (read-only)
  [env.apiKeys?.analytics || 'analytics-api-key-placeholder', {
    read: true,
    write: false,
    delete: false,
    endpoints: ['/api/v1/bikes', '/api/v1/stations', '/api/v1/maintenance'],
  }],
  // Partner API key (limited access)
  [env.apiKeys?.partner || 'partner-api-key-placeholder', {
    read: true,
    write: true,
    delete: false,
    endpoints: ['/api/v1/bikes', '/api/v1/reservations'],
  }],
]);

/**
 * Get HTTP method type
 * @param method HTTP method
 * @returns Method type (read, write, delete)
 */
const getMethodType = (method: string): 'read' | 'write' | 'delete' => {
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return 'read';
  }
  if (method === 'DELETE') {
    return 'delete';
  }
  return 'write'; // POST, PUT, PATCH
};

/**
 * Check if API key has access to endpoint
 * @param permissions API key permissions
 * @param endpoint Request endpoint
 * @returns Whether API key has access
 */
const hasEndpointAccess = (permissions: ApiKeyPermissions, endpoint: string): boolean => {
  if (permissions.endpoints.includes('*')) {
    return true;
  }
  return permissions.endpoints.some(allowedEndpoint => 
    endpoint === allowedEndpoint || endpoint.startsWith(`${allowedEndpoint}/`)
  );
};

/**
 * Validate API key middleware
 * Secures endpoints that require API key authentication
 */
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip validation in test environment if configured to do so
    if (env.isTest && env.skipApiKeyValidation) {
      return next();
    }
    
    // Get API key from request header
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      throw ApiError.unauthorized('API key is required');
    }
    
    // Lookup API key permissions
    const permissions = API_KEYS.get(apiKey);
    
    if (!permissions) {
      logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 8)}...`);
      throw ApiError.unauthorized('Invalid API key');
    }
    
    // Check method permissions
    const methodType = getMethodType(req.method);
    if (!permissions[methodType]) {
      throw ApiError.forbidden(`API key does not have ${methodType} permission`);
    }
    
    // Check endpoint permissions
    const endpoint = req.originalUrl.split('?')[0]; // Remove query params
    if (!hasEndpointAccess(permissions, endpoint)) {
      throw ApiError.forbidden(`API key does not have access to this endpoint: ${endpoint}`);
    }
    
    // Attach API key info to request for logging/tracking
    req.apiKey = {
      key: apiKey,
      permissions,
    };
    
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

// Extend Express Request interface to include API key
declare global {
  namespace Express {
    interface Request {
      apiKey?: {
        key: string;
        permissions: ApiKeyPermissions;
      };
    }
  }
}