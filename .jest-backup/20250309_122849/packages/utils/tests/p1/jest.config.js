/** @type {import('ts-jest').JestConfigWithTsJest} */
// Import the base preset
const baseConfig = require('../../.././../jest.preset');

module.exports = {
  // Start from base config instead of package config to avoid roots array
  ...baseConfig,
  
  // Specific P1 settings
  displayName: 'utils-p1',
  
  // Only match P1 tests - use relative path since we're already in utils/tests/p1
  testMatch: [
    '**/*.test.ts'
  ],
  
  // Module resolution - don't include roots from package config
  moduleNameMapper: {
    '^@mexpress/utils/(.*)$': '<rootDir>/../../src/$1'
  },
  
  // Ensure ts-jest is used
  preset: 'ts-jest',
  
  // Increase timeout for integration tests
  testTimeout: 60000,
  
  // Use MongoDB for integration tests if needed
  // This will be set via environment variable:
  // MONGODB_URI=mongodb://localhost:27017/mexpress_test
  
  // For P1 tests, single worker is more reliable
  maxWorkers: 1
};