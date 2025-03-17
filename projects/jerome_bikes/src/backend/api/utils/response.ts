/**
 * API Response Formatting
 * Standardized response structure for API
 */
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * Standard API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: any;
}

/**
 * API error interface
 */
export interface ApiError {
  message: string;
  code: number;
  details?: any;
  stack?: string;
}

/**
 * Send success response
 * @param res Express response
 * @param data Response data
 * @param statusCode HTTP status code
 * @param metadata Additional metadata
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = StatusCodes.OK,
  metadata?: any
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (metadata) {
    response.metadata = metadata;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param res Express response
 * @param message Error message
 * @param statusCode HTTP status code
 * @param details Additional error details
 * @param stack Error stack trace (only in development)
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  details?: any,
  stack?: string
): Response => {
  const response: ApiResponse<undefined> = {
    success: false,
    error: {
      message,
      code: statusCode,
      details,
      stack,
    },
  };

  return res.status(statusCode).json(response);
};