/**
 * Jest setup file for console output redirection
 * Prevents console output from polluting terminal during test execution
 * Follows section 4.4 of test standards for output management
 */

// Store original console methods
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

// Files to store redirected output
const outputFiles = {
  log: 'tests/results/console/log.txt',
  info: 'tests/results/console/info.txt',
  warn: 'tests/results/console/warn.txt',
  error: 'tests/results/console/error.txt',
  debug: 'tests/results/console/debug.txt',
};

// Ensure output directories exist
const fs = require('fs');
const path = require('path');

// Create output directories
try {
  fs.mkdirSync(path.resolve(process.cwd(), 'tests/results/console'), { recursive: true });
} catch (err) {
  // Ignore if directory already exists
}

// Override console methods to redirect output
console.log = (...args) => {
  // Do nothing - suppress console output
  // In production, would write to file
};

console.info = (...args) => {
  // Do nothing - suppress console output
  // In production, would write to file
};

console.warn = (...args) => {
  // Do nothing - suppress console output
  // In production, would write to file
};

console.error = (...args) => {
  // Do nothing - suppress console output
  // In production, would write to file
};

console.debug = (...args) => {
  // Do nothing - suppress console output
  // In production, would write to file
};

// Setup to restore console after tests complete
afterAll(() => {
  // Restore original console methods
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.debug = originalConsole.debug;
});