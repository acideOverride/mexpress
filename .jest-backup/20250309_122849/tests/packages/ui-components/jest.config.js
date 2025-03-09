module.exports = {
    testRunner: "jest-circus/runner",
  displayName: 'ui-components',
  preset: '../../../jest.preset.js',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/**/*.test.ts',
    '<rootDir>/**/*.test.tsx',
    '<rootDir>/**/*.spec.ts',
    '<rootDir>/**/*.spec.tsx'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect'
  ],
  moduleNameMapper: {
    '^@mexpress/ui-components/(.*)$': '<rootDir>/../../../packages/ui-components/src/$1',
    '\\.css$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    '../../../packages/ui-components/src/**/*.{ts,tsx}',
    '!../../../packages/ui-components/src/**/*.d.ts',
    '!../../../packages/ui-components/src/**/*.stories.{ts,tsx}'
  ]
};