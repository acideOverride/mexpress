/**
 * Setup file for the test environment
 */

// Define the Handler type for REST endpoints
type Handler = (req: any, res: any, ctx: any) => any;

// Define the REST request type
interface RestRequest {
  type: string;
  url: string;
  handler: Handler;
}

// Define the server interface
interface MockServer {
  use: jest.Mock;
  listen: jest.Mock;
  close: jest.Mock;
  resetHandlers: jest.Mock;
}

// Mock server implementation
export const server: MockServer = {
  use: jest.fn(),
  listen: jest.fn(),
  close: jest.fn(),
  resetHandlers: jest.fn()
};

// Mock rest implementation
export const rest = {
  get: (url: string, handler: Handler): RestRequest => ({ type: 'GET', url, handler }),
  post: (url: string, handler: Handler): RestRequest => ({ type: 'POST', url, handler }),
  patch: (url: string, handler: Handler): RestRequest => ({ type: 'PATCH', url, handler }),
  delete: (url: string, handler: Handler): RestRequest => ({ type: 'DELETE', url, handler })
};

// Setup global test environment
jest.mock('@testing-library/react', () => {
  const original = jest.requireActual('@testing-library/react');
  return {
    ...original,
    configure: jest.fn()
  };
});

// Define localStorage interface
interface MockStorage {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  clear: jest.Mock;
}

// Mock localStorage
const mockLocalStorage: MockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Define the global object for TypeScript
declare global {
  var localStorage: MockStorage;
  var matchMedia: jest.Mock;
}

// Assign to global
global.localStorage = mockLocalStorage;

// Define MediaQueryList interface
interface MockMediaQueryList {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: jest.Mock;
  removeListener: jest.Mock;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  dispatchEvent: jest.Mock;
}

// Mock matchMedia
global.matchMedia = jest.fn().mockImplementation((query: string): MockMediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}));