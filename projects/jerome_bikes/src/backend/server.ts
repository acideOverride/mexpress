/**
 * Server entry point
 * Initializes the application and starts the server
 */
import { createExpressApp } from './config/express';
import { connectToDatabase } from './db/mongodb';
import { connectToRedis } from './db/redis';
import { env } from '../shared/config/env';

/**
 * Start the server
 */
async function startServer() {
  try {
    console.log(`[Server] Starting in ${env.env} mode...`);

    // Connect to MongoDB
    await connectToDatabase();

    // Connect to Redis (non-blocking)
    connectToRedis().catch(error => {
      console.warn('[Server] Redis connection failed, continuing without Redis:', error.message);
    });

    // Initialize Express app
    const app = createExpressApp();

    // Start server
    const server = app.listen(env.port, () => {
      console.log(`[Server] Server started on port ${env.port}`);
      console.log(`[Server] API is available at http://localhost:${env.port}/api`);
      console.log(`[Server] Frontend URL is set to ${env.frontendUrl}`);
    });

    // Handle graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`[Server] ${signal} received, shutting down gracefully...`);
      
      server.close(() => {
        console.log('[Server] HTTP server closed');
      });
      
      try {
        await Promise.all([
          import('./db/mongodb').then(({ disconnectFromDatabase }) => disconnectFromDatabase()),
          import('./db/redis').then(({ disconnectFromRedis }) => disconnectFromRedis()),
        ]);
        console.log('[Server] All database connections closed');
        process.exit(0);
      } catch (error) {
        console.error('[Server] Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions and rejections
    process.on('uncaughtException', (error) => {
      console.error('[Server] Uncaught exception:', error);
      gracefulShutdown('Uncaught exception');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Server] Unhandled rejection at:', promise, 'reason:', reason);
    });

    return server;
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export default startServer;