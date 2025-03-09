/**
 * UI Components Jest Configuration
 * Using standardized dynamic configuration approach
 * STANDARDIZED VERSION - 2025-03-15
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const baseConfig = require('../../jest.preset');
const jestUtils = require('../../jest.utils');

// Create the base package config for UI components
const packageConfig = {
  ...baseConfig,
  displayName: 'ui-components',
  testRunner: "jest-circus/runner",
  testEnvironment: 'jsdom',  // Use jsdom for UI components
  
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    // Handle CSS and asset imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/../../packages/core/tests/__mocks__/fileMock.js'
  },
  
  // UI component coverage collection
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ],

  // Use standard reporter
  reporters: [
    'default',
    ['../../packages/core/jest/jest.simplified.reporter.js', {
      outputFile: 'tests/results/[priority]/[name].test.json'
    }]
  ],

  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts'
  ],
  
  // Transform configuration for TypeScript and React
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.json',
      isolatedModules: true
    }]
  }
};

// Use dynamic configuration utility
module.exports = jestUtils.createDynamicConfig('ui-components', packageConfig);