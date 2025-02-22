/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'p1-high',
  testMatch: ['<rootDir>/src/__tests__/p1/**/*.test.ts'],
  
  // P1 tests get medium resources and balanced limits
  globals: {
    __RESOURCE_LIMITS__: {
      test: {
        maxSuiteMemory: 768,      // 768MB - balanced memory
        maxSuiteDuration: 60000,   // 60s max for high priority
        maxConcurrentSuites: 2,    // Some parallelization
        maxTestDuration: 2000      // 2s max per test
      },
      process: {
        maxCpuUsage: 70,          // Moderate CPU usage
        maxMemoryUsage: 70,        // Moderate memory usage
        maxFileDescriptors: 800
      }
    },
    __PERFORMANCE_BASELINES__: {
      execution: {
        setup: 200,               // 200ms setup
        teardown: 200,           // 200ms teardown
        assertion: 100           // 100ms per assertion
      },
      memory: {
        baselineUsage: 192,      // 192MB baseline
        maxIncrease: 384         // 384MB max increase
      },
      throughput: {
        testsPerSecond: 5,
        suitesPerMinute: 20      // Moderate suite throughput
      }
    }
  },

  // High but not critical coverage requirements for P1
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },

  // Use minimal reporter with P1 path
  reporters: [
    ['./jest.minimal-reporter.js', {
      outputFile: 'src/__tests__/results/p1/unit/[name].test.json'
    }]
  ]
};