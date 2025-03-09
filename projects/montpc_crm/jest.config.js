/**
 * MontPC CRM Root Jest Configuration
 * Using standardized dynamic configuration approach
 * STANDARDIZED VERSION - 2025-03-16
 * @type {import('ts-jest').JestConfigWithTsJest}
 */

// Simplified configuration to avoid using projects array
module.exports = {
  displayName: 'montpc-crm',
  
  // Basic configuration
  rootDir: '/opt/mExpress/projects/montpc_crm',
  testRunner: "jest-circus/runner",
  testEnvironment: "node",
  
  // Instead of projects array, use testMatch
  testMatch: [
    '**/tests/**/*.test.ts?(x)',
    '**/frontend/src/**/*.test.ts?(x)'
  ],
  
  // Transform configuration for TypeScript
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true
    }]
  }
};
