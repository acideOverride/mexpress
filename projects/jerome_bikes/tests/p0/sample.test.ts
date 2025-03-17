/**
 * Sample test file to verify Jest configuration
 */

describe('Sample Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle asynchronous tests', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
  });

  it('should handle mocks', () => {
    const mockFn = jest.fn().mockReturnValue(42);
    expect(mockFn()).toBe(42);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});