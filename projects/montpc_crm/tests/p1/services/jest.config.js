module.exports = {
  displayName: 'external-integration',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true
      }
    }]
  },
  setupFilesAfterEnv: [
    '<rootDir>/setup.js'
  ],
  testMatch: [
    '**/external-integration.test.ts'
  ],
  verbose: true
};