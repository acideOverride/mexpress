module.exports = {
  displayName: 'montpc_crm-frontend-simplified',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
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
    '<rootDir>/**/*.test.{ts,js,tsx}'
  ],
  rootDir: '/opt/mExpress/projects/montpc_crm/tests/frontend',
  setupFilesAfterEnv: [
    '/opt/mExpress/projects/montpc_crm/tests/frontend/__mocks__/setup.ts',
    '/opt/mExpress/projects/montpc_crm/tests/frontend/p0/setupTests.ts'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@montpc/crm/(.*)$': '/opt/mExpress/projects/montpc_crm/$1',
    '^react$': '/opt/mExpress/node_modules/react',
    '^react-dom$': '/opt/mExpress/node_modules/react-dom',
    '^@testing-library/(.*)$': '/opt/mExpress/node_modules/@testing-library/$1'
  },
  verbose: true,
  silent: false
};