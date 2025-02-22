import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock localStorage
export const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Setup MSW
export const server = setupServer(
  // Default handlers can be added here
  rest.get('*', (req, res, ctx) => {
    console.warn('No handler for', req.url.toString());
    return res(ctx.status(404));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());