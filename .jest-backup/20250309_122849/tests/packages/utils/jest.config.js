module.exports = {
    testRunner: "jest-circus/runner",
  displayName: 'utils',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/**/*.test.ts',
    '<rootDir>/**/*.test.tsx',
    '<rootDir>/**/*.spec.ts',
    '<rootDir>/**/*.spec.tsx'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/setup.ts'
  ],
  moduleNameMapper: {
    '^@mexpress/utils/(.*)$': '<rootDir>/../../../packages/utils/src/$1'
  },
  collectCoverageFrom: [
    '../../../packages/utils/src/**/*.{ts,tsx}',
    '!../../../packages/utils/src/**/*.d.ts',
    '!../../../packages/utils/src/**/*.stories.{ts,tsx}'
  ]
};