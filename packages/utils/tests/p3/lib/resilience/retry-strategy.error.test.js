const fs = require('fs');
const path = require('path');

const TEST_OUTPUT_FILE = path.join(process.cwd(), 'test-output', 'retry-strategy-error.log');

const logTestOutput = (message) => {
  fs.appendFileSync(TEST_OUTPUT_FILE, `${new Date().toISOString()} - ${message}\n`);
};

// Mock RetryStrategy implementation for testing
class RetryStrategy {
  constructor(config = {}, logger = () => {}) {
    this.config = {
      maxAttempts: config.maxAttempts || 3,
      baseDelay: config.baseDelay || 1000,
      maxDelay: config.maxDelay || 10000,
      exponentialBackoff: config.exponentialBackoff !== undefined ? config.exponentialBackoff : true,
      jitter: config.jitter !== undefined ? config.jitter : true
    };
    this.logger = logger;
  }

  async execute(operation) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        this.logger(`[RetryStrategy] Attempt ${attempt}/${this.config.maxAttempts}`);
        return await operation();
      } catch (error) {
        this.logger(`[RetryStrategy] Error on attempt ${attempt}: ${error}`);
        lastError = error;
        
        if (attempt < this.config.maxAttempts) {
          const delayMs = this.calculateDelay(attempt);
          this.logger(`[RetryStrategy] Waiting ${delayMs}ms before next attempt`);
          await this.delay(attempt);
        }
      }
    }

    // If we've exhausted all attempts, throw the last error
    this.logger(`[RetryStrategy] All attempts exhausted, throwing error: ${lastError}`);
    
    if (lastError instanceof Error) {
      // Preserve original Error objects
      throw lastError;
    } else if (lastError === null || lastError === undefined) {
      // Handle null/undefined explicitly
      throw new Error(String(lastError));
    } else if (typeof lastError === 'string') {
      // Convert strings to Error objects
      throw new Error(lastError);
    } else {
      // Convert any other type to string and wrap in Error
      throw new Error(String(lastError));
    }
  }

  calculateDelay(attempt) {
    let delay = this.config.exponentialBackoff
      ? Math.min(this.config.baseDelay * Math.pow(2, attempt - 1), this.config.maxDelay)
      : this.config.baseDelay;

    if (this.config.jitter) {
      // Add random jitter between 0-100% of the delay
      delay = delay * (1 + Math.random());
    }

    return Math.min(delay, this.config.maxDelay);
  }

  async delay(attempt) {
    const delayMs = this.calculateDelay(attempt);
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }
}

describe('RetryStrategy Error Handling', () => {
  let strategy;
  let mockTime;

  beforeAll(() => {
    // Clear test output file
    if (fs.existsSync(TEST_OUTPUT_FILE)) {
      fs.unlinkSync(TEST_OUTPUT_FILE);
    }
    fs.mkdirSync(path.dirname(TEST_OUTPUT_FILE), { recursive: true });
  });

  beforeEach(() => {
    mockTime = 0;
    const mockLogger = (message) => logTestOutput(message);
    const mockTimeProvider = () => mockTime;

    jest.useFakeTimers();
    strategy = new RetryStrategy({
      maxAttempts: 2,
      baseDelay: 100,
      exponentialBackoff: false,
      jitter: false
    }, mockLogger);

    logTestOutput(`\n[TEST START] ${expect.getState().currentTestName}`);
  });

  afterEach(() => {
    jest.useRealTimers();
    logTestOutput(`[TEST END] ${expect.getState().currentTestName}\n`);
  });

  const advanceTime = async (ms) => {
    mockTime += ms;
    await jest.advanceTimersByTimeAsync(ms);
  };

  it('should throw after max attempts with string error', async () => {
    const operation = jest.fn().mockRejectedValue('Operation failed');
    let thrownError;

    const promise = strategy.execute(operation).catch(err => {
      thrownError = err;
    });

    // First attempt
    await advanceTime(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt
    await advanceTime(100);
    expect(operation).toHaveBeenCalledTimes(2);

    await promise;

    logTestOutput(JSON.stringify({
      test: 'string error',
      calls: operation.mock.calls.length,
      error: thrownError instanceof Error ? thrownError.message : String(thrownError),
      isError: thrownError instanceof Error
    }, null, 2));

    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError instanceof Error && thrownError.message).toBe('Operation failed');
  });

  it('should preserve Error objects', async () => {
    const originalError = new Error('Custom error');
    const operation = jest.fn().mockRejectedValue(originalError);
    let thrownError;

    const promise = strategy.execute(operation).catch(err => {
      thrownError = err;
    });

    // First attempt
    await advanceTime(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt
    await advanceTime(100);
    expect(operation).toHaveBeenCalledTimes(2);

    await promise;

    logTestOutput(JSON.stringify({
      test: 'preserve Error',
      calls: operation.mock.calls.length,
      error: thrownError instanceof Error ? thrownError.message : String(thrownError),
      isOriginalError: thrownError === originalError
    }, null, 2));

    expect(thrownError).toBe(originalError);
    expect(thrownError instanceof Error && thrownError.message).toBe('Custom error');
  });

  it('should convert non-Error rejections to Error objects', async () => {
    const operation = jest.fn().mockRejectedValue(123);
    let thrownError;

    const promise = strategy.execute(operation).catch(err => {
      thrownError = err;
    });

    // First attempt
    await advanceTime(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt
    await advanceTime(100);
    expect(operation).toHaveBeenCalledTimes(2);

    await promise;

    logTestOutput(JSON.stringify({
      test: 'non-Error rejection',
      calls: operation.mock.calls.length,
      error: thrownError instanceof Error ? thrownError.message : String(thrownError),
      isError: thrownError instanceof Error
    }, null, 2));

    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError instanceof Error && thrownError.message).toBe('123');
  });

  it('should handle null/undefined rejections', async () => {
    const operation = jest.fn().mockRejectedValue(null);
    let thrownError;

    const promise = strategy.execute(operation).catch(err => {
      thrownError = err;
    });

    // First attempt
    await advanceTime(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt
    await advanceTime(100);
    expect(operation).toHaveBeenCalledTimes(2);

    await promise;

    logTestOutput(JSON.stringify({
      test: 'null rejection',
      calls: operation.mock.calls.length,
      error: thrownError instanceof Error ? thrownError.message : String(thrownError),
      isError: thrownError instanceof Error
    }, null, 2));

    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError instanceof Error && thrownError.message).toBe('null');
  });
});