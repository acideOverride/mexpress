/**
 * Request Validation Middleware
 * Uses Joi for request validation
 */
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error';

enum ValidationSource {
  BODY = 'body',
  PARAMS = 'params',
  QUERY = 'query',
  HEADERS = 'headers',
}

/**
 * Validate request data against Joi schema
 * @param schema Joi validation schema
 * @param source Data source to validate (body, params, query, headers)
 */
export const validate = (schema: Schema, source: ValidationSource = ValidationSource.BODY) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const details = error.details.map((err) => ({
          message: err.message,
          path: err.path,
          type: err.type,
        }));

        throw ApiError.validation('Validation error', details);
      }

      // Replace the validated object with sanitized data
      req[source] = value;
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            message: error.message,
            details: error.details,
            code: error.statusCode,
          },
        });
      }
      
      next(error);
    }
  };
};

// Export validation source enum
export { ValidationSource };