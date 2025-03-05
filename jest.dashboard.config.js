/**
 * Jest Dashboard Configuration
 * This configuration extends your base Jest setup to add the dashboard reporter
 */

const path = require('path');

// Get base config depending on your setup
let baseConfig;
try {
  baseConfig = require('./jest.config');
} catch (error) {
  try {
    baseConfig = require('./jest.preset');
  } catch (error) {
    console.warn('Could not find base Jest config, using defaults');
    baseConfig = {};
  }
}

// Export configuration with dashboard reporter added
module.exports = {
  ...baseConfig,
  reporters: [
    'default',
    [
      '/opt/mExpress/dashboard/unified/jest-dashboard-reporter.js',
      {
        resultsDir: '/opt/mExpress/tests/results'
      }
    ]
  ]
};
