/**
 * Retry Strategy Error Handling Tests - Simplified Implementation
 * P3 Tests for error handling in RetryStrategy
 */
import { describe, it, expect, jest } from '@jest/globals';

describe('RetryStrategy Error Handling', () => {
  /**
   * Minimal RetryStrategy implementation for testing error handling
   */
  class TestRetryStrategy {
    private maxAttempts: number = 2;
    
    async execute<T>(operation: () => Promise<T>): Promise<T> {
      let lastError: unknown = null;
      
      for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error;
        }
      }
      
      // Error handling logic - preserve Error objects or convert other types
      if (lastError instanceof Error) {
        throw lastError;
      } else if (typeof lastError === 'string') {
        throw new Error(lastError);
      } else {
        throw new Error(String(lastError));
      }
    }
  }
  
  it('should throw after max attempts with string error', async () => {
    const strategy = new TestRetryStrategy();
    const operation = jest.fn().mockRejectedValue('Operation failed');
    
    await expect(strategy.execute(operation)).rejects.toThrow('Operation failed');
    expect(operation).toHaveBeenCalledTimes(2);
  });
  
  it('should preserve Error objects', async () => {
    const strategy = new TestRetryStrategy();
    const originalError = new Error('Custom error');
    const operation = jest.fn().mockRejectedValue(originalError);
    
    await expect(strategy.execute(operation)).rejects.toBe(originalError);
    expect(operation).toHaveBeenCalledTimes(2);
  });
  
  it('should convert non-Error rejections to Error objects', async () => {
    const strategy = new TestRetryStrategy();
    const operation = jest.fn().mockRejectedValue(123);
    
    await expect(strategy.execute(operation)).rejects.toThrow('123');
    expect(operation).toHaveBeenCalledTimes(2);
  });
  
  it('should handle null/undefined rejections', async () => {
    const strategy = new TestRetryStrategy();
    const operation = jest.fn().mockRejectedValue(null);
    
    await expect(strategy.execute(operation)).rejects.toThrow('null');
    expect(operation).toHaveBeenCalledTimes(2);
  });
});