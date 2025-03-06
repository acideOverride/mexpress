module.exports = {
  displayName: 'utils-resilience-simplified',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowJs: true,
        noImplicitAny: false,
        strict: false
      }
    }]
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: [
    '<rootDir>/**/*.test.{ts,js}'
  ],
  rootDir: '/opt/mExpress/packages/utils/tests',
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    '^@mexpress/utils/(.*)$': '/opt/mExpress/packages/utils/src/$1'
  },
  verbose: true,
  silent: false
};