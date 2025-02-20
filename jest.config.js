/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'backend',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  
  // Backend-specific coverage collection
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/types/**'
  ],

  // Backend-specific resource limits
  globals: {
    ...baseConfig.globals,
    __RESOURCE_LIMITS__: {
      ...baseConfig.globals.__RESOURCE_LIMITS__,
      test: {
        ...baseConfig.globals.__RESOURCE_LIMITS__.test,
        maxConcurrentSuites: 2, // Lower for backend tests
        maxSuiteMemory: 1024    // 1GB for backend
      }
    }
  }
};