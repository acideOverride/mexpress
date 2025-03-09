/**
 * Vue Components Jest Configuration
 * Standardized configuration for the Vue Components package
 * Created: 2025-03-09
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = require('../../jest.preset');
const jestUtils = require('../../jest.utils');
const path = require('path');

// Create the base package config for Vue components
const packageConfig = {
  ...baseConfig,
  displayName: 'vue-components',
  testEnvironment: 'jsdom',  // Vue components require jsdom
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@mexpress/vue-components/(.*)$': '<rootDir>/src/$1',
    // Style and asset mocks
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.json'
    }],
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  moduleFileExtensions: ['vue', 'ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Specific test match pattern for Vue component tests
  testMatch: [
    '<rootDir>/tests/**/*.test.ts?(x)',
    '<rootDir>/src/**/*.test.ts?(x)'
  ],
  // Setup files for the Vue testing environment
  setupFilesAfterEnv: [
    ...(baseConfig.setupFilesAfterEnv || []),
    '<rootDir>/tests/setup.ts'
  ]
};

// Create the mock directories if they don't exist
try {
  const fs = require('fs');
  const mockDir = path.join(__dirname, '__mocks__');
  
  if (!fs.existsSync(mockDir)) {
    fs.mkdirSync(mockDir, { recursive: true });
    
    // Create style mock
    fs.writeFileSync(
      path.join(mockDir, 'styleMock.js'),
      'module.exports = {};'
    );
    
    // Create file mock
    fs.writeFileSync(
      path.join(mockDir, 'fileMock.js'),
      'module.exports = "test-file-stub";'
    );
  }
} catch (err) {
  console.warn('Warning: Failed to create mock directories:', err);
}

// Determine if we're running specific priority tests from command line
// e.g., PRIORITY=p1 npx jest --config packages/vue-components/jest.config.js
const priority = process.env.PRIORITY;
const testType = process.env.TEST_TYPE; 

// Dynamic configuration based on environment variables
if (priority) {
  module.exports = jestUtils.createPriorityConfig('vue-components', priority, packageConfig);
} else if (testType === 'vue') {
  module.exports = jestUtils.createVueConfig('vue-components', packageConfig);
} else {
  // Default to the Vue configuration
  module.exports = {
    ...packageConfig,
    // Use individual configs for projects array to provide better organization
    projects: [
      // Priority configs
      jestUtils.createPriorityConfig('vue-components', 'p0', packageConfig),
      jestUtils.createPriorityConfig('vue-components', 'p1', packageConfig),
      jestUtils.createPriorityConfig('vue-components', 'p2', packageConfig),
      jestUtils.createPriorityConfig('vue-components', 'p3', packageConfig),
    ]
  };
}