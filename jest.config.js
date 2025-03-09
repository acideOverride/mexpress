/**
 * Root Jest Configuration
 * STANDARDIZED VERSION - 2025-03-16
 * @type {import('ts-jest').JestConfigWithTsJest}
 */

// Instead of using projects array, we'll use rootDir and testMatch
module.exports = {
  // Basic Jest configuration
  rootDir: '/opt/mExpress',
  testRunner: "jest-circus/runner",
  testEnvironment: "node",
  
  // Use testMatch with an array of full paths to all test files
  // This achieves the same effect as projects array but avoids the warning
  testMatch: [
    '**/packages/core/tests/**/*.test.ts?(x)',
    '**/packages/utils/tests/**/*.test.ts?(x)',
    '**/projects/montpc_crm/tests/**/*.test.ts?(x)',
    '**/projects/montpc_crm/frontend/src/**/*.test.ts?(x)'
  ],
  
  // Standard Jest configuration
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true
    }]
  },
  
  // Set these explicitly to avoid warnings
  verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};