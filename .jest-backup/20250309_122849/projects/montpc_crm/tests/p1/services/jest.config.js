module.exports = {
    testRunner: "jest-circus/runner",
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
};