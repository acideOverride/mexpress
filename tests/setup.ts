/**
 * Global test setup file
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Add test-specific global configuration
global.testTimeout = 30000; // 30 seconds max test timeout

// Mock console to prevent excessive output during tests
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Restore original console in afterAll
afterAll(() => {
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

// Add global beforeEach/afterEach hooks if needed
beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  // Clean up any global state after each test
});