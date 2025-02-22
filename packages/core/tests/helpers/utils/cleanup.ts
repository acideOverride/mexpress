import { PriorityLevel, TestEnvironment } from '../types';
import { getMockDatabase, getTestEnvironment } from './setup';

/**
 * Cleanup resources based on priority
 */
export async function cleanupTestEnvironment(): Promise<void> {
  const env = getTestEnvironment();
  const db = getMockDatabase();

  try {
    // Cleanup based on priority
    switch (env.priority) {
      case 'p0':
        await cleanupP0Resources(env);
        break;
      case 'p1':
        await cleanupP1Resources(env);
        break;
      case 'p2':
        await cleanupP2Resources(env);
        break;
    }

    // Always disconnect database
    await db.disconnect();

  } catch (error) {
    console.error('Cleanup failed:', error);
    throw error;
  }
}

/**
 * Cleanup P0 (Critical) resources
 */
async function cleanupP0Resources(env: TestEnvironment): Promise<void> {
  const db = getMockDatabase();

  // Rollback any pending transactions
  try {
    await db.rollback();
  } catch (error) {
    // Ignore rollback errors
  }

  if (env.useRealServices) {
    // Cleanup real services
    await cleanupRealServices();
  }

  // Clear sensitive data
  await clearSensitiveData();
}

/**
 * Cleanup P1 (High) resources
 */
async function cleanupP1Resources(env: TestEnvironment): Promise<void> {
  const db = getMockDatabase();

  // Reset mock data
  if (!env.useRealServices) {
    await db.query('TRUNCATE TABLE products');
    await db.query('TRUNCATE TABLE orders');
  }

  // Clear cached data
  clearTestCache();
}

/**
 * Cleanup P2 (Standard) resources
 */
async function cleanupP2Resources(env: TestEnvironment): Promise<void> {
  // Basic cleanup for non-critical resources
  clearTestCache();
}

/**
 * Cleanup real service connections
 */
async function cleanupRealServices(): Promise<void> {
  // TODO: Implement real service cleanup
  // - Close connections
  // - Clear sessions
  // - Reset state
}

/**
 * Clear sensitive test data
 */
async function clearSensitiveData(): Promise<void> {
  const db = getMockDatabase();

  // Clear auth tokens
  await db.query('TRUNCATE TABLE auth');
  
  // Clear permissions
  await db.query('TRUNCATE TABLE permissions');
  
  // Clear sensitive user data
  await db.query('UPDATE users SET password = NULL');
}

/**
 * Clear test cache
 */
function clearTestCache(): void {
  // Clear Jest cache
  if (typeof jest !== 'undefined') {
    jest.clearAllMocks();
    jest.clearAllTimers();
  }

  // Clear module cache
  Object.keys(require.cache).forEach(key => {
    delete require.cache[key];
  });
}

/**
 * Register cleanup hooks for Jest
 */
export function registerCleanupHooks(): void {
  // After each test
  afterEach(async () => {
    try {
      const env = getTestEnvironment();
      
      // Clear mocks
      jest.clearAllMocks();
      
      // Clear timers
      jest.clearAllTimers();
      
      // Basic cleanup
      clearTestCache();
      
    } catch (error) {
      console.warn('Basic cleanup failed:', error);
    }
  });

  // After all tests
  afterAll(async () => {
    try {
      await cleanupTestEnvironment();
    } catch (error) {
      console.error('Final cleanup failed:', error);
      throw error;
    }
  });
}

/**
 * Cleanup specific test resources
 */
export async function cleanupTestResources(resources: string[]): Promise<void> {
  const db = getMockDatabase();
  const env = getTestEnvironment();

  for (const resource of resources) {
    try {
      switch (resource) {
        case 'database':
          await db.disconnect();
          break;
        case 'cache':
          clearTestCache();
          break;
        case 'sensitive':
          await clearSensitiveData();
          break;
        case 'all':
          await cleanupTestEnvironment();
          break;
        default:
          console.warn(`Unknown resource type: ${resource}`);
      }
    } catch (error) {
      console.error(`Failed to cleanup ${resource}:`, error);
      if (env.priority === 'p0') {
        throw error; // Re-throw for critical tests
      }
    }
  }
}