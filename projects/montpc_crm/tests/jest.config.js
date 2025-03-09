/**
 * MontPC CRM Tests Jest Configuration
 * Using standardized dynamic configuration approach
 * STANDARDIZED VERSION - 2025-03-09
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const baseConfig = require('../../../jest.preset');
const jestUtils = require('../../../jest.utils');

// Create the base package config for MontPC CRM tests
const packageConfig = {
  ...baseConfig,
  displayName: 'montpc-tests',
  testRunner: "jest-circus/runner",
  testEnvironment: 'node',
  
  // Use frontend setup file if available, otherwise skip
  setupFilesAfterEnv: [
    '/opt/mExpress/projects/montpc_crm/tests/frontend/__mocks__/setup.ts'
  ],
  
  // Module name mappers for both backend and frontend tests
  moduleNameMapper: {
    '^@mexpress/montpc_crm/(.*)$': '/opt/mExpress/projects/montpc_crm/$1',
    '^@/(.*)$': '/opt/mExpress/projects/montpc_crm/src/$1',
    // Add CSS/asset mocks for frontend tests
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '/opt/mExpress/tests/packages/core/__mocks__/styleMock.js',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '/opt/mExpress/tests/packages/core/__mocks__/fileMock.js'
  },
  
  // Standard coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Collect coverage from all TypeScript files
  collectCoverageFrom: [
    '/opt/mExpress/projects/montpc_crm/src/**/*.{ts,tsx}',
    '!/opt/mExpress/projects/montpc_crm/src/**/*.d.ts',
    '!/opt/mExpress/projects/montpc_crm/src/**/*.stories.{ts,tsx}'
  ]
};

// Custom override for the createPriorityConfig function to properly handle MontPC structure
const customPriorityConfig = (packageName, priority, baseConfig) => {
  return {
    ...baseConfig,
    displayName: `${packageName}-${priority}`,
    testMatch: [
      `<rootDir>/${priority}/**/*.test.ts?(x)`,
      `<rootDir>/frontend/${priority}/**/*.test.ts?(x)`
    ],
    // Priority-specific settings
    testTimeout: jestUtils.getPriorityTimeout(priority),
    maxWorkers: jestUtils.getPriorityWorkers(priority),
  };
};

// Override the dynamic configuration with custom priority handling
const createCustomDynamicConfig = (packageName, baseConfig) => {
  const priority = process.env.PRIORITY;
  const testType = process.env.TEST_TYPE;
  
  if (priority) {
    return customPriorityConfig(packageName, priority, baseConfig);
  }
  
  // Use standard dynamic configuration for other test types
  if (testType) {
    return jestUtils.createDynamicConfig(packageName, baseConfig);
  }
  
  // Default configuration if no environment variables are set
  return {
    ...baseConfig,
    displayName: packageName,
    testMatch: [
      '<rootDir>/p0/**/*.test.ts?(x)',
      '<rootDir>/p1/**/*.test.ts?(x)',
      '<rootDir>/p2/**/*.test.ts?(x)',
      '<rootDir>/p3/**/*.test.ts?(x)',
      '<rootDir>/frontend/p0/**/*.test.ts?(x)',
      '<rootDir>/frontend/p1/**/*.test.ts?(x)',
      '<rootDir>/frontend/p2/**/*.test.ts?(x)',
      '<rootDir>/frontend/p3/**/*.test.ts?(x)',
      '<rootDir>/**/integration/**/*.test.ts?(x)'
    ]
  };
};

// Use our custom dynamic configuration
module.exports = createCustomDynamicConfig('montpc-tests', packageConfig);