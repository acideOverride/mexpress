/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
      ],
      plugins: ['@babel/plugin-transform-typescript']
    }]
  },
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.ts'
  ],
  verbose: true,
  silent: false,
  setupFilesAfterEnv: [
    '<rootDir>/jest.resource-monitor.js',
    '<rootDir>/jest.console-redirect.js'
  ],
  reporters: [
    ['<rootDir>/jest.minimal-reporter.js', {
      outputFile: 'test-output/backend/results.json'
    }]
  ]
}