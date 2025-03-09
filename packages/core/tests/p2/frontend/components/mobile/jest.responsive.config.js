/**
 * Special Jest configuration for responsive layout tests
 * This ensures proper JSDOM environment and setup
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/responsive-layout.test.tsx'],
  setupFilesAfterEnv: ['/opt/mExpress/packages/core/tests/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [2322, 2339, 2345, 2571]
      }
    }]
  },
  globals: {
    testTimeout: 60000
  }
};