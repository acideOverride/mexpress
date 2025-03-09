module.exports = {
    testRunner: "jest-circus/runner",
    testEnvironment: 'jsdom',
    testMatch: [
        '**/p1/**/*.test.{ts,tsx}'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react',
                esModuleInterop: true
            }
        }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: [
        '../../jest/jest.console-redirect.js',
        '<rootDir>/setupTests.ts'
    ],
    // Removing reporters configuration from individual configs
    // Custom reporters are now configured at the top level only
    // Map paths for proper module resolution
    moduleNameMapper: {
        '^@mexpress/core/(.*)$': '<rootDir>/../../src/$1'
    }
};