module.exports = {
    testRunner: "jest-circus/runner",
  displayName: 'core-canonical',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/packages/core/unit/**/*.test.ts',
    '<rootDir>/packages/core/integration/**/*.test.ts',
    '<rootDir>/packages/core/e2e/**/*.test.ts'
  ],
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/../../packages/core/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { 
      isolatedModules: true,
      diagnostics: false,
      transpileOnly: true
    }]
  },
  rootDir: '/opt/mExpress/tests'
};
