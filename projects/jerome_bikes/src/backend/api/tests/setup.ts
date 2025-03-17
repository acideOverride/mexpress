/**
 * API Testing Setup
 * Configures the testing environment for API tests
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import { createExpressApp } from '../../config/express';

// Global variables for testing
declare global {
  var mongoServer: MongoMemoryServer;
}

/**
 * Setup function for API tests
 * Initializes MongoDB in-memory server and Express app
 */
export const setupApiTest = async () => {
  // Create MongoDB Memory Server
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Store in global for cleanup
  global.mongoServer = mongoServer;
  
  // Connect to in-memory database
  await mongoose.connect(mongoUri);
  
  // Create Express app
  const app = createExpressApp();
  
  // Create supertest instance
  const request = supertest(app);
  
  return { app, request };
};

/**
 * Teardown function for API tests
 * Cleans up MongoDB connections
 */
export const teardownApiTest = async () => {
  // Disconnect from MongoDB
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
  
  // Stop MongoDB Memory Server
  if (global.mongoServer) {
    await global.mongoServer.stop();
  }
};

/**
 * Generate test authorization header with JWT
 * @param user User object for token generation
 */
export const getAuthHeader = (user: any) => {
  // This is a simplified version - in a real implementation, 
  // we would generate a proper JWT token
  const token = 'test-jwt-token';
  return { Authorization: `Bearer ${token}` };
};