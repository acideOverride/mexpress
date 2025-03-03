// @ts-nocheck
module.exports = {
  displayName: 'montpc_crm-api-tests',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowJs: true
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '<rootDir>/p1/services/auth.service.test.ts'
  ],
  rootDir: '/opt/mExpress/projects/montpc_crm/tests'
};