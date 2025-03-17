/**
 * MongoDB connection utility
 * Handles connection to MongoDB database and provides common database operations
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from '../../shared/config/env';

// Connection state tracking
let mongoMemoryServer: MongoMemoryServer | null = null;
let isConnected = false;

/**
 * Connect to MongoDB
 * If in test environment, connects to in-memory MongoDB instance
 */
export async function connectToDatabase(): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    let connectionString = env.db.mongodb.uri;

    // If in test environment, use in-memory MongoDB
    if (env.isTest) {
      mongoMemoryServer = await MongoMemoryServer.create();
      connectionString = mongoMemoryServer.getUri();
      console.log(`[MongoDB] Using in-memory MongoDB server at ${connectionString}`);
    }

    // Configure mongoose
    mongoose.set('strictQuery', true);

    // Connect to MongoDB
    await mongoose.connect(connectionString, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`[MongoDB] Connected to ${env.isTest ? 'in-memory' : 'MongoDB'} database`);

    // Log when connection is closed
    mongoose.connection.on('disconnected', () => {
      console.log('[MongoDB] Disconnected from database');
      isConnected = false;
    });

    // Log connection errors
    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Database connection error:', err);
    });
  } catch (error) {
    console.error('[MongoDB] Failed to connect to database:', error);
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    isConnected = false;

    // Close in-memory MongoDB server if applicable
    if (env.isTest && mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }

    console.log('[MongoDB] Disconnected from database');
  } catch (error) {
    console.error('[MongoDB] Failed to disconnect from database:', error);
    throw new Error(`Failed to disconnect from MongoDB: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Check MongoDB connection status
 */
export function isConnectedToDatabase(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

/**
 * Get MongoDB connection object
 */
export function getConnection(): mongoose.Connection {
  if (!isConnected) {
    throw new Error('Not connected to MongoDB. Call connectToDatabase() first.');
  }
  return mongoose.connection;
}

/**
 * Clear all collections in the database
 * Useful for testing
 */
export async function clearDatabase(): Promise<void> {
  if (!isConnected) {
    throw new Error('Not connected to MongoDB. Call connectToDatabase() first.');
  }

  if (!env.isTest) {
    throw new Error('Clearing database is only allowed in test environment.');
  }

  const { collections } = mongoose.connection;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  console.log('[MongoDB] Cleared all collections in database');
}

export default {
  connectToDatabase,
  disconnectFromDatabase,
  isConnectedToDatabase,
  getConnection,
  clearDatabase,
};