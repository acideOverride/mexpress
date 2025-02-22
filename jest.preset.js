module.exports = {
    testMatch: ['**/*.test.ts?(x)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}'
    ],
    // Redirect console output to /dev/null
    silent: true,
    verbose: false,
    maxWorkers: 1,
    // Use minimal reporter
    reporters: [
        ['jest-silent-reporter', {
            useDots: true,
            showWarnings: false,
            showPaths: true
        }]
    ]
};