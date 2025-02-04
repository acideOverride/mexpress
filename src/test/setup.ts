/// <reference types="jest" />
/// <reference types="node" />

// Jest setup file

// Extend the Jest timeout for all tests
jest.setTimeout(10000);

// Global test setup
beforeAll(() => {
  // Add any global test setup here
});

// Global test teardown
afterAll(() => {
  // Add any global test cleanup here
});

// Reset mocks automatically after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Add custom matchers if needed
expect.extend({
  // Add custom matchers here
});

// Error when there are unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});
