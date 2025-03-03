module.exports = {
  projects: [
    '<rootDir>/packages/core/jest.config.js',
    '<rootDir>/packages/ui-components/jest.config.js',
    '<rootDir>/packages/utils/jest.config.js'
  ],
  collectCoverageFrom: [
    '../packages/**/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.stories.{ts,tsx}'
  ],
  coverageDirectory: '<rootDir>/results/packages/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '<rootDir>/results/packages',
      outputName: 'junit.xml'
    }]
  ]
};