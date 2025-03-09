/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }]
  },
  testMatch: [
    '<rootDir>/retry-strategy.error.test.ts'
  ],
  moduleFileExtensions: ['ts', 'js'],
  testTimeout: 10000,
};