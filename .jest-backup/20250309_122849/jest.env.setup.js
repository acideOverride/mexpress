/**
 * Environment setup file for Jest
 * Used to configure environment variables for tests
 */

// Configure output verbosity instead of using silent/verbose flags
process.env.JEST_SILENT = process.env.JEST_SILENT || 'false';
process.env.JEST_VERBOSE = process.env.JEST_VERBOSE || 'false';

// Setup other environment variables needed for tests
process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC'; // Ensure consistent timezone for tests