/**
 * mExpress Jest Configuration Utilities
 * 
 * This file contains utility functions for dynamically generating Jest configurations
 * based on package name, test priority, and test type. It allows us to drastically
 * reduce the number of configuration files while maintaining flexibility.
 * 
 * Created: 2025-03-08
 * Updated: 2025-03-08
 */

/**
 * @typedef {Object} JestConfig
 * @property {string} displayName - Display name for the test configuration
 * @property {string[]} testMatch - Glob patterns to match test files
 * @property {Object} [transform] - Transformations for file types
 * @property {number} [testTimeout] - Timeout for tests in milliseconds
 * @property {(number|string)} [maxWorkers] - Maximum number of workers
 * @property {Object} [globals] - Global variables available in tests
 */

/**
 * Generate a Jest config for a specific test priority
 * @param {string} packageName - Package name (core, utils, etc.)
 * @param {string} priority - Test priority (p0, p1, p2, p3)
 * @param {JestConfig} baseConfig - Base configuration
 * @returns {JestConfig} Jest configuration
 */
function createPriorityConfig(packageName, priority, baseConfig) {
  return {
    ...baseConfig,
    displayName: `${packageName}-${priority}`,
    testMatch: [
      `<rootDir>/tests/${priority}/**/*.test.ts?(x)`
    ],
    // Priority-specific settings
    testTimeout: getPriorityTimeout(priority),
    maxWorkers: getPriorityWorkers(priority),
  };
}

/**
 * Create a configuration for integration tests
 * @param {string} packageName - Package name
 * @param {JestConfig} baseConfig - Base configuration
 * @returns {JestConfig} Jest configuration for integration tests
 */
function createIntegrationConfig(packageName, baseConfig) {
  return {
    ...baseConfig,
    displayName: `${packageName}-integration`,
    testMatch: [
      `<rootDir>/tests/**/integration/**/*.test.ts?(x)`
    ],
    // Integration-specific settings
    testTimeout: 120000,
    maxWorkers: 1,
    globals: {
      ...baseConfig.globals,
      __INTEGRATION__: true,
    }
  };
}

/**
 * Create a configuration for frontend tests
 * @param {string} packageName - Package name
 * @param {JestConfig} baseConfig - Base configuration
 * @returns {JestConfig} Jest configuration for frontend tests
 */
function createFrontendConfig(packageName, baseConfig) {
  return {
    ...baseConfig,
    displayName: `${packageName}-frontend`,
    testEnvironment: 'jsdom',
    testMatch: [
      `<rootDir>/tests/**/frontend/**/*.test.{ts,tsx}`,
      `<rootDir>/src/**/frontend/**/*.test.{ts,tsx}`
    ],
    setupFilesAfterEnv: [
      ...(baseConfig.setupFilesAfterEnv || []),
      '<rootDir>/tests/setupTests.ts',
    ],
    moduleNameMapper: {
      ...baseConfig.moduleNameMapper,
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
      '^.+\\.(css|sass|scss)$': '<rootDir>/tests/mocks/styleMock.js',
      '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/mocks/fileMock.js'
    }
  };
}

/**
 * Create a configuration for React component tests
 * @param {string} packageName - Package name
 * @param {JestConfig} baseConfig - Base configuration
 * @returns {JestConfig} Jest configuration for React component tests
 */
function createReactConfig(packageName, baseConfig) {
  const frontendConfig = createFrontendConfig(packageName, baseConfig);
  
  return {
    ...frontendConfig,
    displayName: `${packageName}-react`,
    testMatch: [
      `<rootDir>/tests/**/*.test.tsx`,
      `<rootDir>/src/**/*.test.tsx`
    ],
    setupFilesAfterEnv: [
      ...(frontendConfig.setupFilesAfterEnv || []),
      '@testing-library/jest-dom/extend-expect'
    ]
  };
}

/**
 * Create a configuration for Vue component tests
 * @param {string} packageName - Package name
 * @param {JestConfig} baseConfig - Base configuration
 * @returns {JestConfig} Jest configuration for Vue component tests
 */
function createVueConfig(packageName, baseConfig) {
  const frontendConfig = createFrontendConfig(packageName, baseConfig);
  
  return {
    ...frontendConfig,
    displayName: `${packageName}-vue`,
    transform: {
      ...frontendConfig.transform,
      '^.+\\.vue$': '@vue/vue3-jest'
    },
    moduleFileExtensions: ['vue', 'ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };
}

/**
 * Get appropriate timeout based on test priority
 * @param {string} priority - Test priority (p0, p1, p2, p3)
 * @returns {number} Timeout in milliseconds
 */
function getPriorityTimeout(priority) {
  switch (priority) {
    case 'p0': return 30000;  // Basic timeout for critical tests
    case 'p1': return 60000;  // Extended timeout for important tests
    case 'p2': return 60000;  // Extended timeout for secondary tests
    case 'p3': return 120000; // Long timeout for performance tests
    default: return 30000;    // Default timeout
  }
}

/**
 * Get appropriate worker count based on test priority
 * @param {string} priority - Test priority (p0, p1, p2, p3)
 * @returns {(number|string)} Number of workers or percentage
 */
function getPriorityWorkers(priority) {
  switch (priority) {
    case 'p0': return '50%';  // Use 50% of cores for critical tests
    case 'p1': return 1;      // Single worker for reliability
    case 'p2': return 1;      // Single worker for reliability
    case 'p3': return 1;      // Single worker for performance tests
    default: return '50%';    // Default to 50% of cores
  }
}

/**
 * Create a dynamic priority configuration based on environment variables
 * @param {string} packageName - Package name (core, utils, etc.)
 * @param {JestConfig} baseConfig - Base configuration
 * @returns {JestConfig} Jest configuration based on environment variables
 */
function createDynamicConfig(packageName, baseConfig) {
  const priority = process.env.PRIORITY;
  const testType = process.env.TEST_TYPE;
  
  if (priority) {
    return createPriorityConfig(packageName, priority, baseConfig);
  }
  
  if (testType === 'integration') {
    return createIntegrationConfig(packageName, baseConfig);
  }
  
  if (testType === 'frontend') {
    return createFrontendConfig(packageName, baseConfig);
  }
  
  if (testType === 'react') {
    return createReactConfig(packageName, baseConfig);
  }
  
  if (testType === 'vue') {
    return createVueConfig(packageName, baseConfig);
  }
  
  // Default full configuration using testMatch instead of projects array
  return {
    ...baseConfig,
    displayName: packageName,
    // Use testMatch to include all test files
    testMatch: [
      '<rootDir>/tests/p0/**/*.test.ts?(x)',
      '<rootDir>/tests/p1/**/*.test.ts?(x)',
      '<rootDir>/tests/p2/**/*.test.ts?(x)',
      '<rootDir>/tests/p3/**/*.test.ts?(x)',
      '<rootDir>/tests/**/integration/**/*.test.ts?(x)'
    ]
  };
}

// Export utility functions
module.exports = {
  createPriorityConfig,
  createIntegrationConfig,
  createFrontendConfig,
  createReactConfig,
  createVueConfig,
  createDynamicConfig,
  getPriorityTimeout,
  getPriorityWorkers
};