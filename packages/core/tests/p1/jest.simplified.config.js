/**
 * Simplified Jest configuration for P1 tests
 */
module.exports = {
  displayName: 'core-p1-simplified',
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  rootDir: '.',
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: false
};