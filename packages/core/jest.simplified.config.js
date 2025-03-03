/**
 * Simplified Jest configuration for debugging P3 tests
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/*.test.js', '**/*.spec.js'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { 
      isolatedModules: true,
      diagnostics: false,
      transpileOnly: true
    }]
  },
  moduleNameMapper: {
    // Core module path aliases
    '^@mexpress/core/(.*)$': '<rootDir>/src/$1',
    // Fix relative paths
    '^../../../../src/core/(.*)$': '<rootDir>/src/core/$1',
    '^../../../src/core/(.*)$': '<rootDir>/src/core/$1',
    // Fix API paths
    '^../../../src/api/(.*)$': '<rootDir>/src/api/$1',
    // Fix other common paths
    '^../../lib/(.*)$': '<rootDir>/src/lib/$1',
    '^../../../services/(.*)$': '<rootDir>/src/services/$1',
    '^../../services/(.*)$': '<rootDir>/src/services/$1',
    '^../../models/(.*)$': '<rootDir>/src/models/$1',
    '^../models/(.*)$': '<rootDir>/src/models/$1',
    // Fix product services
    '^../product.service$': '<rootDir>/tests/p0/product.service',
    '^../catalog-event.service$': '<rootDir>/tests/p1/catalog-event.service',
    // Direct path mappings 
    // All git-workflow-automation references have been removed
  },
  verbose: true,
  silent: false
};