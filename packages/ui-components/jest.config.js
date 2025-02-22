/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'backend',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  
  // Include all test files
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx'
  ],

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  
  // Backend-specific coverage collection
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/types/**'
  ],

  // Use minimal reporter with correct output path
  reporters: [
    'default',
    ['./jest.minimal-reporter.js', {
      outputFile: 'src/__tests__/results/[priority]/[name].test.json'
    }]
  ],

  // Backend-specific resource limits
  globals: {
    __RESOURCE_LIMITS__: {
      test: {
        maxSuiteMemory: 1024,    // 1GB for backend
        maxSuiteDuration: 300000, // 5 minutes
        maxConcurrentSuites: 2    // Lower for backend tests
      },
      process: {
        maxCpuUsage: 70,     // 70%
        maxMemoryUsage: 80,  // 80%
        maxFileDescriptors: 1000
      }
    },
    __PERFORMANCE_BASELINES__: {
      execution: {
        setup: 100,      // 100ms
        teardown: 100,   // 100ms
        assertion: 50    // 50ms
      },
      memory: {
        baselineUsage: 256,  // 256MB
        maxIncrease: 512     // 512MB
      },
      throughput: {
        testsPerSecond: 10,
        suitesPerMinute: 2
      }
    }
  }
};