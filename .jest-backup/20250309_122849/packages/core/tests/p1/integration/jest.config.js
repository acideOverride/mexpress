module.exports = {
    testRunner: "jest-circus/runner",
  testEnvironment: 'node',
  testMatch: ['**/integration/*.test.js', '!**/infrastructure/*.test.js', '!**/core/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  rootDir: '../..'
};