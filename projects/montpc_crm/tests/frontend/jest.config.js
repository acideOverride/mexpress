module.exports = {
  displayName: 'montpc_crm-frontend',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'jsdom',
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
    '^@mexpress/core/(.*)$': '<rootDir>/../../../../packages/core/src/$1',
    '^@mexpress/ui-components/(.*)$': '<rootDir>/../../../../packages/ui-components/src/$1',
    '^@montpc/crm/(.*)$': '<rootDir>/../../../../projects/montpc_crm/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
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