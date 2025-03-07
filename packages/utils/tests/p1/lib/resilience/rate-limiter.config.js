module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['<rootDir>/rate-limiter.resilience.test.ts'],
  rootDir: '.',
  forceExit: true
};