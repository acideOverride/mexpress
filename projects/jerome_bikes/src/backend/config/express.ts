/**
 * Express server configuration
 * Sets up middleware, routes, and error handlers
 */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { StatusCodes } from 'http-status-codes';
import { rateLimit } from 'express-rate-limit';
import connectRedis from 'connect-redis';
import { env } from '../../shared/config/env';
import { getRedisClient } from '../db/redis';

// Create Express app
export function createExpressApp() {
  const app = express();

  // Set security HTTP headers
  app.use(helmet());

  // Parse JSON request body
  app.use(express.json());

  // Parse URL-encoded request body
  app.use(express.urlencoded({ extended: true }));

  // Parse cookies
  app.use(cookieParser());

  // Gzip compression
  app.use(compression());

  // Enable CORS
  app.use(cors({
    origin: env.frontendUrl,
    credentials: true,
  }));

  // Request logging
  if (env.env !== 'test') {
    app.use(morgan(env.logging.format));
  }

  // Configure session (if Redis is connected)
  if (!env.isTest) {
    try {
      const RedisStore = connectRedis(session);
      const redisClient = getRedisClient();
      
      app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: env.jwt.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: env.isProduction,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
      }));
    } catch (error) {
      console.warn('[Express] Redis not available for session storage. Using memory store.');
    }
  }

  // Apply rate limiting to all requests
  if (!env.isTest) {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
      })
    );
  }

  // API health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API monitoring middleware
  const { monitorRequest, getMetrics } = require('../api/middleware/monitoring.middleware');
  app.use(monitorRequest);
  app.get('/api/metrics', getMetrics);
  
  // CSRF protection for non-GET requests
  if (!env.isTest) {
    const { generateCsrfToken, validateCsrfToken } = require('../api/middleware/csrf.middleware');
    app.use(generateCsrfToken);
    app.use(validateCsrfToken);
  }
  
  // Import and mount API routes
  const apiRoutes = require('../api/routes').default;
  app.use('/api', apiRoutes);
  
  // Setup Swagger documentation
  if (env.isDevelopment || env.isTest) {
    const { setupSwagger } = require('../api/docs/swagger');
    setupSwagger(app);
  }

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
      error: {
        code: StatusCodes.NOT_FOUND,
        message: 'Not found',
        details: `Route ${req.method} ${req.path} not found`,
      },
    });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('[Express] Error:', err);
    
    const statusCode = 'statusCode' in err && typeof (err as any).statusCode === 'number'
      ? (err as any).statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;
    
    const response = {
      error: {
        code: statusCode,
        message: err.message || 'Internal server error',
        stack: env.isDevelopment ? err.stack : undefined,
      },
    };
    
    res.status(statusCode).json(response);
  });

  return app;
}

export default createExpressApp;