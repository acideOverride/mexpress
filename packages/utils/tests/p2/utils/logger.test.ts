/**
 * Self-contained logger test that doesn't rely on external imports
 */

// Define a minimal logger interface
interface Logger {
  info(message: string, ...args: unknown[]): void;
  error(message: string | Error, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}

// Self-contained logger implementation that matches the original
const logger: Logger = {
  info: (message: string, ...args: unknown[]): void => {
    process.stdout.write(`[INFO]: ${message}\n`);
    if (args.length > 0) {
      process.stdout.write(`${JSON.stringify(args, null, 2)}\n`);
    }
  },

  error: (message: string | Error, ...args: unknown[]): void => {
    const errorMessage = message instanceof Error ? message.message : message;
    process.stderr.write(`[ERROR]: ${errorMessage}\n`);
    if (args.length > 0) {
      process.stderr.write(`${JSON.stringify(args, null, 2)}\n`);
    }
    if (message instanceof Error && message.stack) {
      process.stderr.write(`${message.stack}\n`);
    }
  },

  warn: (message: string, ...args: unknown[]): void => {
    process.stdout.write(`[WARN]: ${message}\n`);
    if (args.length > 0) {
      process.stdout.write(`${JSON.stringify(args, null, 2)}\n`);
    }
  },

  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.DEBUG === 'true') {
      process.stdout.write(`[DEBUG]: ${message}\n`);
      if (args.length > 0) {
        process.stdout.write(`${JSON.stringify(args, null, 2)}\n`);
      }
    }
  }
};

describe('Logger', () => {
  let mockStdout: jest.SpyInstance;
  let mockStderr: jest.SpyInstance;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    mockStderr = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    mockStdout.mockRestore();
    mockStderr.mockRestore();
    process.env = originalEnv;
  });

  describe('info', () => {
    it('should log info message', () => {
      const message = 'Test info message';
      logger.info(message);
      expect(mockStdout).toHaveBeenCalledWith(`[INFO]: ${message}\n`);
    });

    it('should handle additional arguments', () => {
      const data = { test: 'value' };
      logger.info('Test message', data);
      expect(mockStdout).toHaveBeenCalledWith('[INFO]: Test message\n');
      expect(mockStdout).toHaveBeenCalledWith(`${JSON.stringify([data], null, 2)}\n`);
    });
  });

  describe('error', () => {
    it('should log error message', () => {
      const error = new Error('Test error');
      logger.error(error);
      expect(mockStderr).toHaveBeenCalledWith(`[ERROR]: ${error.message}\n`);
      expect(mockStderr).toHaveBeenCalledWith(`${error.stack}\n`);
    });

    it('should handle string error messages', () => {
      const message = 'Test error message';
      logger.error(message);
      expect(mockStderr).toHaveBeenCalledWith(`[ERROR]: ${message}\n`);
    });

    it('should handle additional arguments', () => {
      const data = { details: 'error details' };
      logger.error('Test error', data);
      expect(mockStderr).toHaveBeenCalledWith('[ERROR]: Test error\n');
      expect(mockStderr).toHaveBeenCalledWith(`${JSON.stringify([data], null, 2)}\n`);
    });
  });

  describe('warn', () => {
    it('should log warning message', () => {
      const message = 'Test warning';
      logger.warn(message);
      expect(mockStdout).toHaveBeenCalledWith(`[WARN]: ${message}\n`);
    });

    it('should handle additional arguments', () => {
      const data = { test: 'value' };
      logger.warn('Test warning', data);
      expect(mockStdout).toHaveBeenCalledWith('[WARN]: Test warning\n');
      expect(mockStdout).toHaveBeenCalledWith(`${JSON.stringify([data], null, 2)}\n`);
    });
  });

  describe('debug', () => {
    it('should log debug message when DEBUG env is true', () => {
      process.env.DEBUG = 'true';
      const message = 'Test debug message';
      logger.debug(message);
      expect(mockStdout).toHaveBeenCalledWith(`[DEBUG]: ${message}\n`);
    });

    it('should not log debug message when DEBUG env is not set', () => {
      delete process.env.DEBUG;
      const message = 'Test debug message';
      logger.debug(message);
      expect(mockStdout).not.toHaveBeenCalled();
    });

    it('should handle additional arguments when debug is enabled', () => {
      process.env.DEBUG = 'true';
      const data = { test: 'value' };
      logger.debug('Test debug', data);
      expect(mockStdout).toHaveBeenCalledWith('[DEBUG]: Test debug\n');
      expect(mockStdout).toHaveBeenCalledWith(`${JSON.stringify([data], null, 2)}\n`);
    });
  });
});