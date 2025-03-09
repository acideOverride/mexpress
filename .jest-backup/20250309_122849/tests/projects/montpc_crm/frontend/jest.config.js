module.exports = {
    testRunner: "jest-circus/runner",
  displayName: 'montpc_crm-frontend',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/**/*.test.ts',
    '<rootDir>/**/*.test.tsx',
    '<rootDir>/**/*.spec.ts',
    '<rootDir>/**/*.spec.tsx'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/setup/setupTests.ts'
  ],
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/../../../../packages/core/src/$1',
    '^@mexpress/ui-components/(.*)$': '<rootDir>/../../../../packages/ui-components/src/$1',
    '^@montpc/crm/(.*)$': '<rootDir>/../../../../projects/montpc_crm/frontend/src/$1',
    '\\.css$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    '../../../../projects/montpc_crm/frontend/src/**/*.{ts,tsx}',
    '!../../../../projects/montpc_crm/frontend/src/**/*.d.ts',
    '!../../../../projects/montpc_crm/frontend/src/**/*.stories.{ts,tsx}'
  ]
};