module.exports = {
    testRunner: "jest-circus/runner",
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/../../../packages/core/src/$1'
  },
  testMatch: ['<rootDir>/**/*.test.ts'],
};