/**
 * MontPC CRM Frontend Jest Configuration
 * Using standardized dynamic configuration approach
 * STANDARDIZED VERSION - 2025-03-16
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const baseConfig = require('../../../jest.preset');
const jestUtils = require('../../../jest.utils');

// Create the base package config for MontPC CRM Frontend
const packageConfig = {
  ...baseConfig,
  displayName: 'montpc-frontend',
  testRunner: "jest-circus/runner",
  testEnvironment: "jsdom",
  
  setupFilesAfterEnv: [
    "/opt/mExpress/projects/montpc_crm/frontend/src/setupTests.ts"
  ],
  
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: "/opt/mExpress/projects/montpc_crm/frontend/tsconfig.json"
    }]
  },
  
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "/opt/mExpress/projects/montpc_crm/frontend/src/$1"
  },
  
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/setupTests.ts"
  ]
};

// Use dynamic configuration utility
module.exports = jestUtils.createDynamicConfig('montpc-frontend', packageConfig);