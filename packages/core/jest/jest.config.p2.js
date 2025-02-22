/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'p2-standard',
  testMatch: ['<rootDir>/src/__tests__/p2/**/*.test.ts'],
  
  // P2 tests get lower resources and relaxed limits
  globals: {
    __RESOURCE_LIMITS__: {
      test: {
        maxSuiteMemory: 512,      // 512MB - lower memory
        maxSuiteDuration: 120000,  // 120s max for standard tests
        maxConcurrentSuites: 4,    // More parallelization
        maxTestDuration: 5000      // 5s max per test
      },
      process: {
        maxCpuUsage: 60,          // Lower CPU usage
        maxMemoryUsage: 60,        // Lower memory usage
        maxFileDescriptors: 500
      }
    },
    __PERFORMANCE_BASELINES__: {
      execution: {
        setup: 500,               // 500ms setup
        teardown: 500,           // 500ms teardown
        assertion: 200           // 200ms per assertion
      },
      memory: {
        baselineUsage: 128,      // 128MB baseline
        maxIncrease: 256         // 256MB max increase
      },
      throughput: {
        testsPerSecond: 2,
        suitesPerMinute: 10      // Lower suite throughput
      }
    }
  },

  // Standard coverage requirements for P2
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Use minimal reporter with P2 path
  reporters: [
    ['./jest.minimal-reporter.js', {
      outputFile: 'src/__tests__/results/p2/unit/[name].test.json'
    }]
  ]
};