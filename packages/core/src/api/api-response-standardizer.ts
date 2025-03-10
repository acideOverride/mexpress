import { Request, Response, NextFunction } from 'express';

/**
 * API Response Standardizer
 * 
 * Implements the standard response format defined in the API Development Standards:
 * 
 * Success Response Format:
 * {
 *   status: 'success',
 *   data: T,
 *   meta?: {
 *     pagination?: {
 *       page: number,
 *       limit: number,
 *       total: number,
 *       pages: number
 *     },
 *     timestamp: string,
 *     version: string
 *   }
 * }
 * 
 * Error Response Format:
 * {
 *   status: 'error',
 *   error: {
 *     code: string,
 *     message: string,
 *     details?: {
 *       field?: string,
 *       reason?: string,
 *       suggestion?: string
 *     }[]
 *   },
 *   meta: {
 *     requestId: string,
 *     timestamp: string,
 *     path: string,
 *     version: string
 *   }
 * }
 */

// API Version
const API_VERSION = 'v1';

/**
 * Middleware to standardize API responses
 */
export const standardizeResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Store original methods
  const originalJson = res.json;
  const originalStatus = res.status;
  
  // Store original status for use in formatters
  let statusCode = 200;
  
  // Override status method to track status code
  res.status = function(code: number) {
    statusCode = code;
    return originalStatus.call(this, code);
  };
  
  // Override json method to format response
  res.json = function(body: any) {
    // If response is already in standard format, don't modify it
    if (body && (body.status === 'success' || body.status === 'error')) {
      return originalJson.call(this, body);
    }
    
    // Format response based on status code
    const formattedResponse = formatResponse(body, statusCode, req);
    return originalJson.call(this, formattedResponse);
  };
  
  next();
};

/**
 * Format response based on status code
 */
function formatResponse(body: any, statusCode: number, req: Request) {
  // Success response (2xx status codes)
  if (statusCode >= 200 && statusCode < 300) {
    return formatSuccessResponse(body);
  }
  
  // Error response
  return formatErrorResponse(body, statusCode, req);
}

/**
 * Format success response according to API standards
 */
function formatSuccessResponse(data: any) {
  // Get pagination data if it exists
  const pagination = data?.meta?.pagination;
  
  return {
    status: 'success',
    data: isPrimitiveResponse(data) ? { value: data } : removeMetaFromData(data),
    meta: {
      timestamp: new Date().toISOString(),
      version: API_VERSION,
      ...(pagination && { pagination })
    }
  };
}

/**
 * Format error response according to API standards
 */
function formatErrorResponse(error: any, statusCode: number, req: Request) {
  // Default error information
  let errorCode = 'INTERNAL_ERROR';
  let errorMessage = 'An unexpected error occurred';
  let errorDetails = undefined;
  
  // Extract error information if available
  if (error) {
    if (error.error) {
      // If error already has proper structure, use it
      errorCode = error.error.code || errorCode;
      errorMessage = error.error.message || errorMessage;
      errorDetails = error.error.details;
    } else if (error.message) {
      // If error has a message, use it
      errorMessage = error.message;
      
      // Try to determine error code from status and message
      errorCode = determineErrorCode(statusCode, error.message);
    }
  }
  
  return {
    status: 'error',
    error: {
      code: errorCode,
      message: errorMessage,
      ...(errorDetails && { details: errorDetails })
    },
    meta: {
      requestId: req.headers['x-request-id'] || generateRequestId(),
      timestamp: new Date().toISOString(),
      path: req.originalUrl || req.url,
      version: API_VERSION
    }
  };
}

/**
 * Determine error code based on status code and message
 */
function determineErrorCode(statusCode: number, message: string): string {
  const messageLower = message.toLowerCase();
  
  switch (statusCode) {
    case 400:
      if (messageLower.includes('validation')) return 'VALIDATION_ERROR';
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'UNPROCESSABLE_ENTITY';
    case 429:
      return 'TOO_MANY_REQUESTS';
    default:
      return 'INTERNAL_ERROR';
  }
}

/**
 * Generate a request ID
 */
function generateRequestId(): string {
  return `req-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Check if response is a primitive value that needs to be wrapped
 */
function isPrimitiveResponse(data: any): boolean {
  return (
    data === null ||
    data === undefined ||
    typeof data === 'string' ||
    typeof data === 'number' ||
    typeof data === 'boolean'
  );
}

/**
 * Remove meta property from data to avoid duplication
 */
function removeMetaFromData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  // If it's an array, return as is
  if (Array.isArray(data)) {
    return data;
  }
  
  // Create a copy without meta property
  const { meta, ...rest } = data;
  return rest;
}