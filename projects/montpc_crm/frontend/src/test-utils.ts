/**
 * Simple mock function implementation for browser testing
 */
export function createMockFn() {
  const mockFn = function(...args: any[]) {
    mockFn.mock.calls.push(args);
    mockFn.mock.lastCall = args;
    return mockFn.mock.returnValue;
  };

  mockFn.mock = {
    calls: [] as any[][],
    lastCall: null as any[] | null,
    returnValue: undefined,
  };

  mockFn.mockReturnValue = function(value: any) {
    mockFn.mock.returnValue = value;
    return mockFn;
  };

  mockFn.mockReset = function() {
    mockFn.mock.calls = [];
    mockFn.mock.lastCall = null;
    mockFn.mock.returnValue = undefined;
    return mockFn;
  };

  return mockFn;
}