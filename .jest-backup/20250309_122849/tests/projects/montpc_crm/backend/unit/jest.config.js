module.exports = {
    testRunner: "jest-circus/runner",
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@montpc/crm/(.*)$': '<rootDir>/../../../projects/montpc_crm/src/$1'
  },
  testMatch: ['<rootDir>/**/*.test.ts'],
};