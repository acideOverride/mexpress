// Import Jest DOM extensions
require('@testing-library/jest-dom');

// Mock for localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Mock for document methods
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

// Add custom matchers
expect.extend({
  toHaveValue(received, expected) {
    // Custom matcher for checking input values
    const pass = received && 
      ((received.value === expected) || // Regular input
       (received.getAttribute && received.getAttribute('value') === expected)); // React component
    
    return {
      pass,
      message: () => 
        pass 
        ? `Expected ${received} not to have value "${expected}"`
        : `Expected ${received} to have value "${expected}"`
    };
  }
});