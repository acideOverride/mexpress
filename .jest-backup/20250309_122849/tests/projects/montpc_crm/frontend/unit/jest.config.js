module.exports = {
    testRunner: "jest-circus/runner",
  displayName: 'frontend-components',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowJs: true,
        skipLibCheck: true
      }
    }]
  },
  // Use our local setup file
  setupFilesAfterEnv: [
    '<rootDir>/tests/projects/montpc_crm/frontend/unit/setup.js'
  ],
  testMatch: [
    '**/components.test.js'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],
  // Set the rootDir to ensure paths are resolved correctly
  rootDir: '/opt/mExpress'
};