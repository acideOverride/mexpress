/**
 * Custom API Error class
 * Extends Error to include HTTP status code and optional details
 */
import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  statusCode: number;
  details?: any;
  
  /**
   * Create a new API error
   * @param message Error message
   * @param statusCode HTTP status code
   * @param details Additional error details
   */
  constructor(
    message: string,
    statusCode: number | StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
    details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a BadRequest error (400)
   * @param message Error message
   * @param details Additional error details
   */
  static badRequest(message: string = 'Bad Request', details?: any): ApiError {
    return new ApiError(message, StatusCodes.BAD_REQUEST, details);
  }

  /**
   * Create an Unauthorized error (401)
   * @param message Error message
   * @param details Additional error details
   */
  static unauthorized(message: string = 'Unauthorized', details?: any): ApiError {
    return new ApiError(message, StatusCodes.UNAUTHORIZED, details);
  }

  /**
   * Create a Forbidden error (403)
   * @param message Error message
   * @param details Additional error details
   */
  static forbidden(message: string = 'Forbidden', details?: any): ApiError {
    return new ApiError(message, StatusCodes.FORBIDDEN, details);
  }

  /**
   * Create a Not Found error (404)
   * @param message Error message
   * @param details Additional error details
   */
  static notFound(message: string = 'Resource not found', details?: any): ApiError {
    return new ApiError(message, StatusCodes.NOT_FOUND, details);
  }

  /**
   * Create a Conflict error (409)
   * @param message Error message
   * @param details Additional error details
   */
  static conflict(message: string = 'Resource conflict', details?: any): ApiError {
    return new ApiError(message, StatusCodes.CONFLICT, details);
  }

  /**
   * Create a Validation error (422)
   * @param message Error message
   * @param details Validation error details
   */
  static validation(message: string = 'Validation error', details?: any): ApiError {
    return new ApiError(message, StatusCodes.UNPROCESSABLE_ENTITY, details);
  }

  /**
   * Create a Server error (500)
   * @param message Error message
   * @param details Additional error details
   */
  static internal(message: string = 'Internal server error', details?: any): ApiError {
    return new ApiError(message, StatusCodes.INTERNAL_SERVER_ERROR, details);
  }
}