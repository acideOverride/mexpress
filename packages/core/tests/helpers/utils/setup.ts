import { PriorityLevel, TestEnvironment } from '../types';
import { MockDatabase } from '../mocks/database';
import { getFixtures, FIXTURE_QUERIES } from '../fixtures/database';

/**
 * Default test environments by priority
 */
const DEFAULT_ENVIRONMENTS: Record<PriorityLevel, TestEnvironment> = {
  p0: {
    priority: 'p0',
    useRealServices: true,
    logging: true,
    timeouts: {
      test: 5000,    // 5s
      setup: 1000,   // 1s
      teardown: 1000,// 1s
      operation: 500 // 500ms
    },
    retries: {
      max: 0,        // No retries for critical
      delay: 0
    }
  },
  p1: {
    priority: 'p1',
    useRealServices: false,
    logging: true,
    timeouts: {
      test: 10000,   // 10s
      setup: 2000,   // 2s
      teardown: 2000,// 2s
      operation: 1000// 1s
    },
    retries: {
      max: 3,        // 3 retries
      delay: 1000    // 1s delay
    }
  },
  p2: {
    priority: 'p2',
    useRealServices: false,
    logging: false,
    timeouts: {
      test: 30000,   // 30s
      setup: 5000,   // 5s
      teardown: 5000,// 5s
      operation: 2000// 2s
    },
    retries: {
      max: 5,        // 5 retries
      delay: 2000    // 2s delay
    }
  }
};

/**
 * Test environment state
 */
let currentEnvironment: TestEnvironment | null = null;
let mockDb: MockDatabase | null = null;

/**
 * Initialize test environment
 */
export async function initializeTestEnvironment(
  priority: PriorityLevel,
  customConfig: Partial<TestEnvironment> = {}
): Promise<TestEnvironment> {
  // Merge default with custom config
  const config = {
    ...DEFAULT_ENVIRONMENTS[priority],
    ...customConfig
  };

  // Store current environment
  currentEnvironment = config;

  // Initialize database
  mockDb = new MockDatabase(priority);
  await mockDb.connect();

  // Set global timeouts
  jest.setTimeout(config.timeouts.test);

  // Setup test database if needed
  if (!config.useRealServices) {
    await setupTestDatabase(priority);
  }

  return config;
}

/**
 * Setup test database with fixtures
 */
async function setupTestDatabase(priority: PriorityLevel): Promise<void> {
  if (!mockDb) throw new Error('Database not initialized');

  // Create tables
  for (const query of Object.values(FIXTURE_QUERIES.createTables)) {
    await mockDb.query(query);
  }

  // Insert fixture data
  const insertQueries = FIXTURE_QUERIES.generateInserts(priority);
  for (const query of Object.values(insertQueries)) {
    await mockDb.query(query);
  }
}

/**
 * Get current test environment
 */
export function getTestEnvironment(): TestEnvironment {
  if (!currentEnvironment) {
    throw new Error('Test environment not initialized');
  }
  return currentEnvironment;
}

/**
 * Get mock database instance
 */
export function getMockDatabase(): MockDatabase {
  if (!mockDb) {
    throw new Error('Database not initialized');
  }
  return mockDb;
}

/**
 * Reset test environment between tests
 */
export async function resetTestEnvironment(): Promise<void> {
  if (!mockDb || !currentEnvironment) return;

  if (!currentEnvironment.useRealServices) {
    // Truncate all tables
    const tables = Object.keys(FIXTURE_QUERIES.createTables);
    for (const table of tables) {
      await mockDb.query(`TRUNCATE TABLE ${table}`);
    }

    // Reload fixtures
    await setupTestDatabase(currentEnvironment.priority);
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = currentEnvironment?.retries.max || 0,
  delay: number = currentEnvironment?.retries.delay || 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) break;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(2, attempt))
      );
    }
  }

  throw lastError;
}

/**
 * Wait for condition with timeout
 */
export async function waitForCondition(
  condition: () => Promise<boolean> | boolean,
  timeout: number = currentEnvironment?.timeouts.operation || 5000,
  interval: number = 100
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) return true;
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  return false;
}