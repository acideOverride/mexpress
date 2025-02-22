// Redirect all console output to files
const fs = require('fs');
const util = require('util');

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Create write streams for different log levels
const errorStream = fs.createWriteStream('logs/test-errors.log', { flags: 'a' });
const warnStream = fs.createWriteStream('logs/test-warnings.log', { flags: 'a' });
const infoStream = fs.createWriteStream('logs/test-info.log', { flags: 'a' });

// Store original console methods
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error
};

// Helper to format messages
const formatMessage = (args) => {
  const timestamp = new Date().toISOString();
  const message = util.format.apply(null, args);
  return `[${timestamp}] ${message}\n`;
};

// Override console methods
console.log = (...args) => {
  infoStream.write(formatMessage(args));
};

console.info = (...args) => {
  infoStream.write(formatMessage(args));
};

console.warn = (...args) => {
  warnStream.write(formatMessage(args));
};

console.error = (...args) => {
  errorStream.write(formatMessage(args));
};

// Clean up streams after tests
afterAll(() => {
  return new Promise((resolve) => {
    errorStream.end();
    warnStream.end();
    infoStream.end();
    
    // Wait for streams to finish
    Promise.all([
      new Promise(r => errorStream.on('finish', r)),
      new Promise(r => warnStream.on('finish', r)),
      new Promise(r => infoStream.on('finish', r))
    ]).then(() => {
      // Restore original console methods
      Object.assign(console, originalConsole);
      resolve();
    });
  });
});