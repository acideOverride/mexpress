/**
 * Main Jest configuration file for mExpress core package
 * This configuration uses the standardized dynamic approach
 * STANDARDIZED VERSION - 2025-03-16
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const baseConfig = require('../../jest.preset');
const jestUtils = require('../../jest.utils');

// Create the base package config
const packageConfig = {
  ...baseConfig,
  displayName: 'core',
  setupFilesAfterEnv: [
    '<rootDir>/jest/jest.mongodb.setup.js',
    '<rootDir>/jest/jest.console-redirect.js'
  ],
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '\!src/**/*.d.ts',
    '\!src/**/index.ts',
    '\!**/node_modules/**',
    '\!**/__tests__/**'
  ],
  coverageDirectory: '<rootDir>/tests/results/coverage',
  reporters: [
    'default'
    // Custom reporters are moved to globals to avoid warnings
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      tsconfig: './tsconfig.json'
    }]
  },
  
  // Standard Jest options moved to globals to avoid warnings
  globals: {
    ...baseConfig.globals,
    // Add custom reporters to globals
    reporters: [
      'default',
      ['<rootDir>/jest/jest.simplified.reporter.js', {}]
    ]
  }
};

// Use our dynamic configuration utility
module.exports = jestUtils.createDynamicConfig('core', packageConfig);
