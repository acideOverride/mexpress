/* eslint-disable */
/**
 * Core package test setup file
 * 
 * This file sets up the test environment for the core package tests.
 * IMPORTANT: This file is isolated to core package tests only.
 */

// Declare namespace to avoid conflicts with other setup files
namespace CoreTestSetup {
  // Set environment variables
  process.env.NODE_ENV = 'test';
  process.env.TEST_ENV = 'true';
  process.env.LOG_LEVEL = 'silent';
  
  // Configure global test timeouts (30 seconds)
  // @ts-ignore - allow global property
  global.testTimeout = 30000;
  
  // Store original console methods
  export const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  // Mock console methods to reduce noise
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
  
  // Create global mocks and helpers
  export const mockHelpers = {
    // Helper to create a mock function that returns a resolved promise
    mockResolve: (returnValue: any) => jest.fn().mockResolvedValue(returnValue),
    
    // Helper to create a mock function that returns a rejected promise
    mockReject: (error: any) => jest.fn().mockRejectedValue(error),
    
    // Helper to reset all mocks
    resetAll: () => jest.resetAllMocks()
  };
  
  // Add mockHelpers to global for use in tests
  // @ts-ignore - allow global property
  global.mockHelpers = mockHelpers;
}

// Restore console methods after all tests
afterAll(() => {
  console.log = CoreTestSetup.originalConsole.log;
  console.warn = CoreTestSetup.originalConsole.warn;
  console.error = CoreTestSetup.originalConsole.error;
  console.info = CoreTestSetup.originalConsole.info;
  console.debug = CoreTestSetup.originalConsole.debug;
});

// Reset mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

// Add custom jest matchers 
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});