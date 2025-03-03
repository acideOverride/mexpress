/**
 * Jest configuration for P3 (Low Priority) tests
 * - Edge cases
 * - Performance tests
 * - Long-running tasks
 */

const baseConfig = require('./jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'p3-tests',
  testMatch: ['**/p3/**/*.test.ts', '**/p3/**/*.test.tsx'],
  
  // Specific settings for P3 tests
  testTimeout: 30000, // 30 seconds for lower priority tests
  
  // Use minimal reporter and console redirection
  reporters: [
    'default'
  ],
  setupFilesAfterEnv: [
    './jest.console-redirect.js',
    './jest.resource-monitor.js'
  ],
  
  // Resource management for P3 tests
  globals: {
    __TEST_PRIORITY__: 'p3',
    __RESOURCE_LIMITS__: {
      memory: 2048, // 2GB
      cpuUsage: 0.7, // 70%
      fileDescriptors: 1000,
      responseTime: 500, // 500ms
      concurrency: 4
    }
  },
  
  // P3 tests can run more concurrently
  maxConcurrency: 4,
  
  // Generate coverage but with lower thresholds for P3 tests
  collectCoverage: true,
  coverageDirectory: '<rootDir>/../tests/results/p3/coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};