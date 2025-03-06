/**
 * Simplified Jest configuration for running tests without dependencies
 */
module.exports = {
  displayName: 'montpc_crm-frontend-p1-standalone',
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  rootDir: '.',
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: false
};