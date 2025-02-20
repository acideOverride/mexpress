/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  silent: true,
  verbose: false,
  maxWorkers: 4, // Control parallel execution
  testTimeout: 30000, // 30 seconds max per test

  // Resource Management
  globals: {
    __RESOURCE_LIMITS__: {
      test: {
        maxConcurrentSuites: 4,
        maxTestsPerSuite: 50,
        maxSuiteMemory: 2048,  // 2GB
        maxSuiteDuration: 300000 // 5 minutes
      },
      process: {
        maxCpuUsage: 70,     // 70%
        maxMemoryUsage: 80,  // 80%
        maxFileDescriptors: 1000
      },
      output: {
        maxLogSize: 5242880,  // 5MB
        maxErrorSize: 1048576 // 1MB
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
        suitsPerMinute: 2
      }
    }
  },

  // Coverage Configuration
  coverageDirectory: 'logs',
  coverageReporters: ['text-summary'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },

  // Test Categorization
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: [
    // P0 - Critical Tests
    '**/__tests__/p0/**/*.test.ts',
    '**/__tests__/p0/**/*.test.tsx',
    // P1 - High Priority Tests
    '**/__tests__/p1/**/*.test.ts',
    '**/__tests__/p1/**/*.test.tsx',
    // P2 - Medium Priority Tests
    '**/__tests__/p2/**/*.test.ts',
    '**/__tests__/p2/**/*.test.tsx',
    // P3 - Low Priority Tests
    '**/__tests__/p3/**/*.test.ts',
    '**/__tests__/p3/**/*.test.tsx'
  ],

  // Resource Monitoring Setup
  setupFilesAfterEnv: ['<rootDir>/jest.resource-monitor.js'],

  // Output Management
  reporters: [
    ['jest-silent-reporter', {
      useDots: true,
      showWarnings: true,
      showPaths: true
    }],
    ['jest-junit', {
      outputDirectory: 'logs',
      outputName: 'test-results.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ]
};