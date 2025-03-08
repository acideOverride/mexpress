/** @type {import('ts-jest').JestConfigWithTsJest} */
// Import the base configuration preset and utilities
const baseConfig = require('../../jest.preset');
const jestUtils = require('../../jest.utils');

// Create the base package config with utils-specific settings
const packageConfig = {
  ...baseConfig,
  displayName: 'utils',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  
  // Module resolution - package-specific paths
  moduleNameMapper: {
    '^@mexpress/utils/(.*)$': '<rootDir>/src/$1'
  },
  
  // TypeScript configuration - with local tsconfig reference
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.json'
    }]
  }
};

// Use dynamic configuration generation based on environment variables
module.exports = jestUtils.createDynamicConfig('utils', packageConfig);