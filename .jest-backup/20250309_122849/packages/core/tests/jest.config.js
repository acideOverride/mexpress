module.exports = {
    testRunner: "jest-circus/runner",
  displayName: 'mexpress',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/p0/**/*.test.{ts,js,tsx}',
    '<rootDir>/p1/**/*.test.{ts,js,tsx}',
    '<rootDir>/p2/**/*.test.{ts,js,tsx}',
    '<rootDir>/p3/**/*.test.{ts,js,tsx}',
    '<rootDir>/integration/**/*.test.{ts,js,tsx}'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/__mocks__/setup.ts'
  ],
  moduleNameMapper: {
    '^@mexpress/mexpress/(.*)$': '<rootDir>/src//opt/mExpress/packages/core/tests-new'
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ]
};
