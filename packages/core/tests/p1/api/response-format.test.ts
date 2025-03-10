import request from 'supertest';
import express, { Request, Response } from 'express';
import { standardizeResponseMiddleware } from '../../../src/api/api-response-standardizer';

describe('API Response Format Standardization', () => {
  let app: express.Express;
  
  beforeEach(() => {
    // Create a new Express app for each test
    app = express();
    
    // Apply the standardize response middleware
    app.use(standardizeResponseMiddleware);
    
    // Setup test routes
    app.get('/success', (req: Request, res: Response) => {
      res.status(200).json({ name: 'John', email: 'john@example.com' });
    });
    
    app.get('/success-array', (req: Request, res: Response) => {
      res.status(200).json([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ]);
    });
    
    app.get('/success-primitive', (req: Request, res: Response) => {
      res.status(200).json('Simple string response');
    });
    
    app.get('/pagination', (req: Request, res: Response) => {
      res.status(200).json({
        customers: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ],
        meta: {
          pagination: {
            page: 1,
            limit: 10,
            total: 50,
            pages: 5
          }
        }
      });
    });
    
    app.get('/error', (req: Request, res: Response) => {
      res.status(400).json({ message: 'Invalid request parameters' });
    });
    
    app.get('/error-not-found', (req: Request, res: Response) => {
      res.status(404).json({ message: 'Resource not found' });
    });
    
    app.get('/error-server', (req: Request, res: Response) => {
      res.status(500).json({ message: 'Internal server error' });
    });
    
    app.get('/error-detailed', (req: Request, res: Response) => {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: [
            {
              field: 'email',
              reason: 'Invalid format',
              suggestion: 'Must be a valid email address'
            }
          ]
        }
      });
    });
    
    // Route that already returns standardized response
    app.get('/already-standardized', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        data: { id: 1, name: 'John' },
        meta: {
          timestamp: new Date().toISOString(),
          version: 'v1'
        }
      });
    });
  });
  
  it('should standardize a success response with object data', async () => {
    const response = await request(app).get('/success');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('name', 'John');
    expect(response.body.data).toHaveProperty('email', 'john@example.com');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('timestamp');
    expect(response.body.meta).toHaveProperty('version', 'v1');
  });
  
  it('should standardize a success response with array data', async () => {
    const response = await request(app).get('/success-array');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty('name', 'John');
    expect(response.body.meta).toHaveProperty('version', 'v1');
  });
  
  it('should wrap primitive response values', async () => {
    const response = await request(app).get('/success-primitive');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('value', 'Simple string response');
    expect(response.body.meta).toHaveProperty('version', 'v1');
  });
  
  it('should include pagination metadata when available', async () => {
    const response = await request(app).get('/pagination');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('customers');
    expect(response.body.meta).toHaveProperty('pagination');
    expect(response.body.meta.pagination).toHaveProperty('page', 1);
    expect(response.body.meta.pagination).toHaveProperty('total', 50);
  });
  
  it('should standardize a client error response', async () => {
    const response = await request(app).get('/error');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('code', 'BAD_REQUEST');
    expect(response.body.error).toHaveProperty('message', 'Invalid request parameters');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('requestId');
    expect(response.body.meta).toHaveProperty('path', '/error');
  });
  
  it('should standardize a not found error response', async () => {
    const response = await request(app).get('/error-not-found');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(response.body.error).toHaveProperty('message', 'Resource not found');
  });
  
  it('should standardize a server error response', async () => {
    const response = await request(app).get('/error-server');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.error).toHaveProperty('code', 'INTERNAL_ERROR');
    expect(response.body.error).toHaveProperty('message', 'Internal server error');
  });
  
  it('should keep detailed error information when provided', async () => {
    const response = await request(app).get('/error-detailed');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(response.body.error).toHaveProperty('message', 'Validation failed');
    expect(response.body.error).toHaveProperty('details');
    expect(response.body.error.details[0]).toHaveProperty('field', 'email');
    expect(response.body.error.details[0]).toHaveProperty('suggestion', 'Must be a valid email address');
  });
  
  it('should not modify responses that are already in standard format', async () => {
    const response = await request(app).get('/already-standardized');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id', 1);
    expect(response.body.data).toHaveProperty('name', 'John');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('timestamp');
    expect(response.body.meta).toHaveProperty('version', 'v1');
  });
});