/**
 * Test priority levels
 */
export type PriorityLevel = 'p0' | 'p1' | 'p2';

/**
 * Base error interface for test helpers
 */
export interface TestError extends Error {
  code?: string;
  details?: unknown;
}

/**
 * Database error interface
 */
export interface DatabaseError extends TestError {
  sqlState?: string;
  sqlMessage?: string;
  sql?: string;
}

/**
 * Mock function types
 */
export type MockFn<T extends (...args: any[]) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;

/**
 * Test environment configuration
 */
export interface TestEnvironment {
  priority: PriorityLevel;
  useRealServices: boolean;
  logging: boolean;
  timeouts: {
    test: number;
    setup: number;
    teardown: number;
    operation: number;
  };
  retries: {
    max: number;
    delay: number;
  };
}

/**
 * Test fixture metadata
 */
export interface FixtureMetadata {
  version: string;
  generated: string;
  priority: PriorityLevel;
  description?: string;
}

/**
 * Test result status
 */
export type TestStatus = 'passed' | 'failed' | 'skipped' | 'pending';

/**
 * Test result metrics
 */
export interface TestMetrics {
  duration: number;
  memory: number;
  cpu: number;
  timestamp: string;
}

/**
 * Test result
 */
export interface TestResult {
  name: string;
  status: TestStatus;
  priority: PriorityLevel;
  error?: TestError;
  metrics: TestMetrics;
}