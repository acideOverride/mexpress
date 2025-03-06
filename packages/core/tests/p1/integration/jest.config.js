module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/integration/*.test.js', '!**/infrastructure/*.test.js', '!**/core/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  verbose: true,
  testTimeout: 10000,
  rootDir: '../..'
};