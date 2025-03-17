/**
 * Auth Middleware Tests
 * Verifies JWT authentication and authorization functionality
 */
import { Request, Response } from 'express';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { ApiError } from '../../../utils/api-error';
import jwt from 'jsonwebtoken';
import { env } from '../../../../../shared/config/env';

// Mock jwt
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    test('should return 401 if no authorization header is present', async () => {
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Authentication required',
          code: 401,
        },
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('should return 401 if authorization header does not start with Bearer', async () => {
      mockRequest.headers = { authorization: 'Token xyz' };

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Authentication required',
          code: 401,
        },
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('should return 401 if no token is provided', async () => {
      mockRequest.headers = { authorization: 'Bearer ' };

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Authentication token missing',
          code: 401,
        },
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('should return 401 if token is invalid', async () => {
      mockRequest.headers = { authorization: 'Bearer invalid-token' };
      
      // Mock jwt.verify to throw an error
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Invalid or expired token',
          code: 401,
        },
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('should call next if token is valid', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      
      // Mock jwt.verify to return a decoded token
      const mockUser = { id: '123', role: 'user' };
      (jwt.verify as jest.Mock).mockReturnValue(mockUser);

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', env.jwt.secret);
      expect(mockRequest.user).toEqual(mockUser);
      expect(mockRequest.token).toEqual('valid-token');
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    test('should return 401 if user is not authenticated', async () => {
      mockRequest = {};
      
      const authorizeMiddleware = authorize(['admin', 'user']);
      
      await authorizeMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 401,
        },
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('should return 403 if user does not have required role', async () => {
      mockRequest = {
        user: { id: '123', role: 'user' },
      };
      
      const authorizeMiddleware = authorize(['admin']);
      
      await authorizeMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Insufficient permissions',
          code: 403,
        },
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('should call next if user has required role', async () => {
      mockRequest = {
        user: { id: '123', role: 'admin' },
      };
      
      const authorizeMiddleware = authorize(['admin', 'superuser']);
      
      await authorizeMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});