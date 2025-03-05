module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@montpc/crm/(.*)$': '<rootDir>/../../../projects/montpc_crm/src/$1'
  },
  testMatch: ['<rootDir>/**/*.test.ts'],
  verbose: true
};