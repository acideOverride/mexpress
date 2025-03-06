module.exports = {
  displayName: 'core-frontend-simplified',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowJs: true,
        noImplicitAny: false,
        strict: false
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/**/*.test.{ts,js,tsx,jsx}'
  ],
  rootDir: '/opt/mExpress/packages/core/tests',
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@mexpress/core/(.*)$': '/opt/mExpress/packages/core/src/$1'
  },
  verbose: true,
  silent: false
};