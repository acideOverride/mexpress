module.exports = {
  projects: [
    '<rootDir>/projects/montpc_crm/frontend/jest.config.js'
  ],
  collectCoverageFrom: [
    '../projects/**/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.stories.{ts,tsx}'
  ],
  coverageDirectory: '<rootDir>/results/projects/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '<rootDir>/results/projects',
      outputName: 'junit.xml'
    }]
  ]
};