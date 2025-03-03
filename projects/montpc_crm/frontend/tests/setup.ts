// Jest setup file
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Silence console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('Warning: React.createFactory') ||
      args[0].includes('Warning: The current testing environment'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Add custom matchers if needed
expect.extend({
  // Add custom matchers here
});