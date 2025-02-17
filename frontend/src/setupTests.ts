import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';

// Mock localStorage with proper types
interface StorageMock {
  getItem: jest.Mock<string | null, [string]>;
  setItem: jest.Mock<void, [string, string]>;
  removeItem: jest.Mock<void, [string]>;
  clear: jest.Mock<void, []>;
  length: number;
  key: jest.Mock<string | null, [number]>;
}

const localStorageMock: StorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// MSW server setup
export const server = setupServer();

// Enable API mocking before tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any runtime request handlers we may add during the tests
afterEach(() => {
  server.resetHandlers();
  localStorageMock.clear.mockClear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
});

// Clean up after the tests are finished
afterAll(() => server.close());

// Export the mock for type safety in tests
export { localStorageMock };