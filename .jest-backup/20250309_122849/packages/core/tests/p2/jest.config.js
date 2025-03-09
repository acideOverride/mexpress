module.exports = {
    testRunner: "jest-circus/runner",
    testEnvironment: 'jsdom',
    testMatch: [
        '**/p2/**/*.test.{ts,tsx,js}'
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: '<rootDir>/../../tsconfig.json',
            jsx: 'react',
            isolatedModules: true
        }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // Global settings (empty after moving ts-jest config to transform)
    globals: {},
    setupFilesAfterEnv: [
        '../../jest/jest.react.setup.js',
        '../../jest/jest.console-redirect.js'
    ],
    // Removing reporters configuration from individual configs
    // Custom reporters are now configured at the top level only
    // Map paths for proper module resolution
    moduleNameMapper: {
        '^@mexpress/core/(.*)$': '<rootDir>/../../src/$1'
    }
};