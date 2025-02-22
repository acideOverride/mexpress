module.exports = {
  displayName: 'montpc_crm',
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
    '^@mexpress/montpc_crm/(.*)$': '<rootDir>/src//opt/mExpress/projects/montpc_crm/tests'
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
