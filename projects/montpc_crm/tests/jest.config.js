/**
 * MontPC CRM Tests Jest Configuration
 * Using standardized dynamic configuration approach
 * STANDARDIZED VERSION - 2025-03-16
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
  
  setupFilesAfterEnv: [
    '/opt/mExpress/projects/montpc_crm/tests/__mocks__/setup.ts'
  ],
  
  moduleNameMapper: {
    '^@mexpress/montpc_crm/(.*)$': '/opt/mExpress/projects/montpc_crm/$1'
  },
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  collectCoverageFrom: [
    '/opt/mExpress/projects/montpc_crm/src/**/*.{ts,tsx}',
    '\!/opt/mExpress/projects/montpc_crm/src/**/*.d.ts'
  ]
};

// Use dynamic configuration utility
module.exports = jestUtils.createDynamicConfig('montpc-tests', packageConfig);
