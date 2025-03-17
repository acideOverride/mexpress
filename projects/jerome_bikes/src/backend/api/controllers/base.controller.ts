/**
 * Base Controller
 * Provides common controller functionality for all API endpoints
 */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';

export class BaseController {
  /**
   * Success response
   * @param res Express response object
   * @param data Response data
   * @param statusCode HTTP status code
   */
  protected sendSuccess(
    res: Response,
    data: any = {},
    statusCode: number = StatusCodes.OK
  ): Response {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  /**
   * Error response
   * @param res Express response object
   * @param error Error object or message
   * @param statusCode HTTP status code
   */
  protected sendError(
    res: Response,
    error: string | Error,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ): Response {
    const errorMessage = error instanceof Error ? error.message : error;
    return res.status(statusCode).json({
      success: false,
      error: {
        message: errorMessage,
        code: statusCode,
      },
    });
  }

  /**
   * Not found response
   * @param res Express response object
   * @param message Custom not found message
   */
  protected sendNotFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return this.sendError(res, message, StatusCodes.NOT_FOUND);
  }

  /**
   * Async request handler to catch errors
   * @param fn Controller function
   */
  protected asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((error) => {
        if (error instanceof ApiError) {
          return this.sendError(res, error.message, error.statusCode);
        }
        next(error);
      });
    };
  }

  /**
   * Parse pagination parameters from request
   * @param req Express request object
   */
  protected getPaginationParams(req: Request): { page: number; limit: number } {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    return { page, limit };
  }

  /**
   * Generate pagination metadata
   * @param page Current page
   * @param limit Items per page
   * @param totalItems Total number of items
   */
  protected getPaginationMetadata(page: number, limit: number, totalItems: number) {
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  }
}