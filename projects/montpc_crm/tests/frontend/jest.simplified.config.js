module.exports = {
  displayName: 'montpc_crm-frontend-simplified',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowJs: true
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/**/*.test.{ts,js,tsx}'
  ],
  rootDir: '/opt/mExpress/projects/montpc_crm/tests/frontend',
  setupFilesAfterEnv: [
    '/opt/mExpress/projects/montpc_crm/tests/frontend/__mocks__/setup.ts'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  verbose: false,
  silent: true
};