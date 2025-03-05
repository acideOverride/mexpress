module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/../../../packages/core/src/$1'
  },
  testMatch: ['<rootDir>/**/*.test.ts'],
  verbose: true
};