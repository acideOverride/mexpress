/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Common settings
  verbose: false,          // Minimize console output
  silent: true,           // Further reduce noise
  maxWorkers: '50%',      // Limit CPU usage
  
  // Timeouts
  testTimeout: 30000,     // 30s default timeout
  
  // Error Handling
  bail: 0,               // Don't stop on failure
  maxConcurrency: 5,     // Limit concurrent tests
  
  // Coverage settings
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'text'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90
    }
  },

  // Transform settings
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      diagnostics: {
        ignoreCodes: [2322, 2339, 2345, 2571]  // Ignore common TS errors in tests
      }
    }]
  },

  // Module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleDirectories: ['node_modules', 'src'],

  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/helpers/utils/assertions.ts'  // Load custom matchers
  ],

  // Global settings
  globals: {
    'ts-jest': {
      isolatedModules: true  // Faster compilation
    }
  },

  // Resource management
  detectOpenHandles: true,   // Help identify resource leaks
  forceExit: true,          // Ensure clean exit
  detectLeaks: true,        // Memory leak detection

  // Output settings
  reporters: [
    'default',
    ['../jest/jest.minimal-reporter.js', {
      outputFile: 'src/__tests__/results/test-results.json'
    }]
  ],

  // Error formatting
  errorOnDeprecated: true,
  prettierPath: null,       // Disable prettier in tests
  
  // Test environment setup
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};