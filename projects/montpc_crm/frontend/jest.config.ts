import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'frontend',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts',
    '../jest.resource-monitor.js'
  ],
  
  // Frontend-specific module mapping
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json'
    }]
  },

  // Frontend-specific coverage collection
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts'
  ],

  // Frontend-specific resource limits
  globals: {
    __RESOURCE_LIMITS__: {
      test: {
        maxConcurrentSuites: 3,  // Higher for frontend tests
        maxSuiteMemory: 1536     // 1.5GB for frontend
      }
    },
    __PERFORMANCE_BASELINES__: {
      execution: {
        setup: 150,      // 150ms for DOM setup
        teardown: 150    // 150ms for DOM cleanup
      }
    }
  }
};

export default config;