/**
 * Simplified Jest configuration for backend tests
 */
module.exports = {
  displayName: 'montpc_crm-backend-simplified',
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  rootDir: '.',
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: false
};