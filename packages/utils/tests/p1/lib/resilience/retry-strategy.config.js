module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['<rootDir>/retry-strategy.test.ts'],
  rootDir: '.',
  forceExit: true
};