/**
 * Error Handling Middleware
 * Provides centralized error handling for API requests
 */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';
import { env } from '../../../shared/config/env';
import logger from '../utils/logger';

/**
 * Global error handler middleware
 * Formats and logs errors before sending response
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 internal server error
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let details: any = undefined;
  
  // Handle ApiError instances
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    // Handle Mongoose validation errors
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation Error';
    details = err.message;
  } else if (err.name === 'CastError') {
    // Handle Mongoose cast errors
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Invalid ID format';
  } else if (err.name === 'JsonWebTokenError') {
    // Handle JWT errors
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    // Handle JWT expiration
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Log the error
  logger.error(`[${statusCode}] ${message}`, {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: statusCode,
      details,
      // Only include stack trace in development
      stack: env.isDevelopment ? err.stack : undefined,
    },
  });
};

/**
 * 404 Not Found middleware
 * Handles requests to undefined routes
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(
    `Not Found - ${req.originalUrl}`,
    StatusCodes.NOT_FOUND
  );
  next(error);
};