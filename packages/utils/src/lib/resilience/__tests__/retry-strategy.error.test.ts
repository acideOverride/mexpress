import { RetryStrategy } from '../retry-strategy';
import * as fs from 'fs';
import * as path from 'path';

const TEST_OUTPUT_FILE = path.join(process.cwd(), 'test-output', 'retry-strategy-error.log');

const logTestOutput = (message: string) => {
  fs.appendFileSync(TEST_OUTPUT_FILE, `${new Date().toISOString()} - ${message}\n`);
};

describe('RetryStrategy Error Handling', () => {
  let strategy: RetryStrategy;
  let mockTime: number;

  beforeAll(() => {
    // Clear test output file
    if (fs.existsSync(TEST_OUTPUT_FILE)) {
      fs.unlinkSync(TEST_OUTPUT_FILE);
    }
    fs.mkdirSync(path.dirname(TEST_OUTPUT_FILE), { recursive: true });
  });

  beforeEach(() => {
    mockTime = 0;
    const mockLogger = (message: string) => logTestOutput(message);
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

  const advanceTime = async (ms: number) => {
    mockTime += ms;
    await jest.advanceTimersByTimeAsync(ms);
  };

  it('should throw after max attempts with string error', async () => {
    const operation = jest.fn().mockRejectedValue('Operation failed');
    let thrownError: unknown;

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
    let thrownError: unknown;

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
    let thrownError: unknown;

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
    let thrownError: unknown;

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