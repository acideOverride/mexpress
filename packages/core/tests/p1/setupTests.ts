/**
 * Setup file for React Testing Library
 * 
 * @file setupTests.ts
 * @BRQ MEXP-2025-005-FE UI Architecture
 */

// Add Jest-DOM matchers
import '@testing-library/jest-dom';

// Fix missing TextEncoder/TextDecoder in jsdom environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Set up mocks for browser APIs that might be missing in Jest environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});