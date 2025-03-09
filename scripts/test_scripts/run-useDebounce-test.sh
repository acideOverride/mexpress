#!/bin/bash

# Create a temporary jest config file
cat > temp-config.js << 'EOL'
module.exports = {
  displayName: 'useDebounce-test',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        target: 'es2015',
        allowJs: true,
        noImplicitAny: false,
        strict: false
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '**/hooks/useDebounce.test.ts'
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
EOL

# Run the test with the temporary config
npx jest --config temp-config.js > /dev/null 2>&1 && echo "PASSED: [useDebounce.test.ts]" || echo "FAILED: [useDebounce.test.ts]"

# Clean up
rm temp-config.js