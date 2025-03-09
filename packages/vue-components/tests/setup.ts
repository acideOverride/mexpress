/**
 * Vue Components Test Setup
 * Sets up the testing environment for Vue components
 */

import '@testing-library/jest-dom';

// Mock window properties commonly used in Vue components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

window.ResizeObserver = ResizeObserverMock as any;

// Mock types from @/types to prevent import errors
jest.mock('@/types', () => {
  // Return the original module to preserve types but mock specific values
  const originalModule = jest.requireActual('@/types');
  
  return {
    ...originalModule,
    // Mock specific values as needed
    SizeVariant: 'medium',
    ColorVariant: 'primary'
  };
}, { virtual: true });

// Set up Vue test-utils specific configuration if needed
console.log('Vue testing environment initialized');