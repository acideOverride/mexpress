/**
 * Jest Test Setup
 * Global setup for API tests
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupApiTest, teardownApiTest } from './setup';

// Store mongoServer instance for cleanup
let mongoServer: MongoMemoryServer;

// Configure timeout for tests
jest.setTimeout(30000);

// Global setup before all tests
beforeAll(async () => {
  try {
    const { mongoServer: server } = await setupApiTest();
    mongoServer = server;
  } catch (error) {
    console.error('Error setting up tests:', error);
    throw error;
  }
});

// Global teardown after all tests
afterAll(async () => {
  try {
    await teardownApiTest();
  } catch (error) {
    console.error('Error tearing down tests:', error);
    throw error;
  }
});