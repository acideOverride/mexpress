/**
 * Global type definitions for test environment
 */

declare namespace NodeJS {
  interface Global {
    testTimeout: number;
    // Add other global variables used in tests
  }
}

// Declare test-specific globals
declare const testTimeout: number;

// Jest extension
declare namespace jest {
  interface Matchers<R> {
    // Add custom matchers here if needed
  }
}