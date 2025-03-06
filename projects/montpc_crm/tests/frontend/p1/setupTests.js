/**
 * Setup file for the test environment
 */

// Mock server implementation
const server = {
  use: jest.fn(),
  listen: jest.fn(),
  close: jest.fn(),
  resetHandlers: jest.fn()
};

// Mock rest implementation
const rest = {
  get: (url, handler) => ({ type: 'GET', url, handler }),
  post: (url, handler) => ({ type: 'POST', url, handler }),
  patch: (url, handler) => ({ type: 'PATCH', url, handler }),
  delete: (url, handler) => ({ type: 'DELETE', url, handler })
};

// Export the mock server and rest objects
module.exports = {
  server,
  rest
};

// Setup global test environment
jest.mock('@testing-library/react', () => {
  const original = jest.requireActual('@testing-library/react');
  return {
    ...original,
    configure: jest.fn()
  };
});

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Mock matchMedia
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}));