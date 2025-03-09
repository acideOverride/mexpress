/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: '../../../../tsconfig.json'
    }]
  },
  // Increase timeout for the tests that use fake timers
  testTimeout: 10000,
  // Fake timers setup
  fakeTimers: {
    enableGlobally: false,
    legacyFakeTimers: false
  },
  // Add module name mapper to resolve imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../../../src/$1'
  },
  // Only run retry-strategy test to focus debugging
  testRegex: 'retry-strategy\\.test\\.ts$'
};