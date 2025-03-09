/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Common settings
  maxWorkers: '50%',      // Limit CPU usage

  // Timeouts (managed via testRunner and env var)
  testRunner: "jest-circus/runner",

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
  setupFilesAfterEnv: [],

  // Global settings - kept for backward compatibility but ts-jest config moved to transform
  globals: {
    // No longer using ts-jest here - moved to transform section
  },

  // Resource management
  detectOpenHandles: true,   // Help identify resource leaks
  forceExit: true,          // Ensure clean exit
  detectLeaks: true,        // Memory leak detection

  // Output settings
  reporters: [['default', {}]],

  // Error formatting
  errorOnDeprecated: true,
  prettierPath: null,       // Disable prettier in tests

  // Test environment setup
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};