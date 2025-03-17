/**
 * Jest Configuration for API Tests
 */
const path = require('path');

module.exports = {
  // Extend from root preset
  preset: '../../../../jest.preset.js',
  
  // Test environment
  testEnvironment: 'node',
  
  // Test file matching pattern
  testMatch: [
    '<rootDir>/src/backend/api/tests/**/*.test.ts',
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/backend/api/tests/jest.setup.ts'],
  
  // Root directory
  rootDir: path.resolve(__dirname, '../../../..'),
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  
  // Transform TypeScript files
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  
  // Coverage configuration
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/backend/api/**/*.ts',
    '!<rootDir>/src/backend/api/tests/**/*.ts',
    '!<rootDir>/src/backend/api/**/*.d.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/api',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Reports configuration
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/test-results/api',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
    [
      'jest-html-reporter',
      {
        pageTitle: 'Jerome Bikes API Test Report',
        outputPath: '<rootDir>/test-results/api/test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],
  
  // Test result processor
  testResultsProcessor: 'jest-sonar-reporter',
  
  // ENV for tests
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  
  // Global patterns to be cleared for each test
  clearMocks: true,
  
  // Max number of jobs to run in parallel
  maxWorkers: '50%',
};