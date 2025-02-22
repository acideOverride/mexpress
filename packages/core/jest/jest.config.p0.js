/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'p0-critical',
  testMatch: ['<rootDir>/src/__tests__/p0/**/*.test.ts'],
  
  // P0 tests get highest resources and strictest limits
  globals: {
    __RESOURCE_LIMITS__: {
      test: {
        maxSuiteMemory: 1024,     // 1GB - critical tests need memory
        maxSuiteDuration: 30000,   // 30s max for critical path
        maxConcurrentSuites: 1,    // Run sequentially for stability
        maxTestDuration: 1000      // 1s max per test
      },
      process: {
        maxCpuUsage: 80,          // Higher CPU allowance
        maxMemoryUsage: 80,        // Higher memory allowance
        maxFileDescriptors: 1000
      }
    },
    __PERFORMANCE_BASELINES__: {
      execution: {
        setup: 100,               // 100ms setup
        teardown: 100,           // 100ms teardown
        assertion: 50            // 50ms per assertion
      },
      memory: {
        baselineUsage: 256,      // 256MB baseline
        maxIncrease: 512         // 512MB max increase
      },
      throughput: {
        testsPerSecond: 10,
        suitesPerMinute: 30      // More suites for critical tests
      }
    }
  },

  // Strict coverage requirements for P0
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },

  // Use minimal reporter with P0 path
  reporters: [
    ['./jest.minimal-reporter.js', {
      outputFile: 'src/__tests__/results/p0/unit/[name].test.json'
    }]
  ]
};