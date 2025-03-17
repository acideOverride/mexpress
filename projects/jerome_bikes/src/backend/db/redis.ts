/**
 * Redis connection utility
 * Handles connection to Redis and provides caching functionality
 */
import Redis from 'ioredis';
import { env } from '../../shared/config/env';

// Redis client singleton
let redisClient: Redis | null = null;
let isConnected = false;

/**
 * Serializes data for Redis storage
 */
function serialize(data: any): string {
  return JSON.stringify(data);
}

/**
 * Deserializes data from Redis storage
 */
function deserialize<T>(data: string | null): T | null {
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('[Redis] Error deserializing data:', error);
    return null;
  }
}

/**
 * Connect to Redis
 */
export async function connectToRedis(): Promise<Redis> {
  if (isConnected && redisClient) {
    return redisClient;
  }

  try {
    // Skip Redis in test environment unless specifically required
    if (env.isTest && !process.env.REDIS_REQUIRED_FOR_TESTS) {
      console.log('[Redis] Skipping Redis connection in test environment');
      // Create a mock Redis client for testing
      redisClient = {} as Redis;
      isConnected = true;
      return redisClient;
    }

    // Create Redis client
    redisClient = new Redis(env.db.redis.url, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      enableOfflineQueue: false,
    });

    // Handle connection events
    redisClient.on('connect', () => {
      console.log('[Redis] Connected to Redis');
      isConnected = true;
    });

    redisClient.on('error', (error) => {
      console.error('[Redis] Redis connection error:', error);
      isConnected = false;
    });

    redisClient.on('close', () => {
      console.log('[Redis] Redis connection closed');
      isConnected = false;
    });

    // Test connection
    await redisClient.ping();
    isConnected = true;
    console.log('[Redis] Successfully connected to Redis');

    return redisClient;
  } catch (error) {
    console.error('[Redis] Failed to connect to Redis:', error);
    throw new Error(`Failed to connect to Redis: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Disconnect from Redis
 */
export async function disconnectFromRedis(): Promise<void> {
  if (!isConnected || !redisClient) {
    return;
  }

  try {
    if (env.isTest && !process.env.REDIS_REQUIRED_FOR_TESTS) {
      // In test environment with mock Redis
      redisClient = null;
      isConnected = false;
      return;
    }

    await redisClient.quit();
    redisClient = null;
    isConnected = false;
    console.log('[Redis] Disconnected from Redis');
  } catch (error) {
    console.error('[Redis] Failed to disconnect from Redis:', error);
    throw new Error(`Failed to disconnect from Redis: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get Redis client instance
 */
export function getRedisClient(): Redis {
  if (!isConnected || !redisClient) {
    throw new Error('Not connected to Redis. Call connectToRedis() first.');
  }
  return redisClient;
}

/**
 * Check if Redis is connected
 */
export function isRedisConnected(): boolean {
  return isConnected && !!redisClient;
}

/**
 * Cache data in Redis
 */
export async function cacheData<T>(key: string, data: T, expirySeconds = 3600): Promise<void> {
  if (!isConnected || !redisClient) {
    throw new Error('Not connected to Redis. Call connectToRedis() first.');
  }

  try {
    if (env.isTest && !process.env.REDIS_REQUIRED_FOR_TESTS) {
      // Mock implementation for tests
      return;
    }

    const serializedData = serialize(data);
    await redisClient.set(key, serializedData, 'EX', expirySeconds);
  } catch (error) {
    console.error(`[Redis] Error caching data for key ${key}:`, error);
    throw new Error(`Failed to cache data in Redis: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get cached data from Redis
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  if (!isConnected || !redisClient) {
    throw new Error('Not connected to Redis. Call connectToRedis() first.');
  }

  try {
    if (env.isTest && !process.env.REDIS_REQUIRED_FOR_TESTS) {
      // Mock implementation for tests
      return null;
    }

    const data = await redisClient.get(key);
    return deserialize<T>(data);
  } catch (error) {
    console.error(`[Redis] Error getting cached data for key ${key}:`, error);
    return null;
  }
}

/**
 * Delete cached data from Redis
 */
export async function deleteCachedData(key: string): Promise<void> {
  if (!isConnected || !redisClient) {
    throw new Error('Not connected to Redis. Call connectToRedis() first.');
  }

  try {
    if (env.isTest && !process.env.REDIS_REQUIRED_FOR_TESTS) {
      // Mock implementation for tests
      return;
    }

    await redisClient.del(key);
  } catch (error) {
    console.error(`[Redis] Error deleting cached data for key ${key}:`, error);
    throw new Error(`Failed to delete cached data from Redis: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Check if a key exists in Redis
 */
export async function keyExists(key: string): Promise<boolean> {
  if (!isConnected || !redisClient) {
    throw new Error('Not connected to Redis. Call connectToRedis() first.');
  }

  try {
    if (env.isTest && !process.env.REDIS_REQUIRED_FOR_TESTS) {
      // Mock implementation for tests
      return false;
    }

    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`[Redis] Error checking if key ${key} exists:`, error);
    return false;
  }
}

/**
 * Cache data with a hash
 */
export async function cacheHashData(key: string, field: string, data: any, expirySeconds = 3600): Promise<void> {
  if (!isConnected || !redisClient) {
    throw new Error('Not connected to Redis. Call connectToRedis() first.');
  }

  try {
    if (env.isTest && !process.env.REDIS_REQUIRED_FOR_TESTS) {
      // Mock implementation for tests
      return;
    }

    const serializedData = serialize(data);
    await redisClient.hset(key, field, serializedData);
    await redisClient.expire(key, expirySeconds);
  } catch (error) {
    console.error(`[Redis] Error caching hash data for key ${key}, field ${field}:`, error);
    throw new Error(`Failed to cache hash data in Redis: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get cached hash data from Redis
 */
export async function getCachedHashData<T>(key: string, field: string): Promise<T | null> {
  if (!isConnected || !redisClient) {
    throw new Error('Not connected to Redis. Call connectToRedis() first.');
  }

  try {
    if (env.isTest && !process.env.REDIS_REQUIRED_FOR_TESTS) {
      // Mock implementation for tests
      return null;
    }

    const data = await redisClient.hget(key, field);
    return deserialize<T>(data);
  } catch (error) {
    console.error(`[Redis] Error getting cached hash data for key ${key}, field ${field}:`, error);
    return null;
  }
}

export default {
  connectToRedis,
  disconnectFromRedis,
  getRedisClient,
  isRedisConnected,
  cacheData,
  getCachedData,
  deleteCachedData,
  keyExists,
  cacheHashData,
  getCachedHashData,
};