import { logger } from '../logger';

describe('Logger', () => {
  let stdoutWrite: jest.SpyInstance;
  let stderrWrite: jest.SpyInstance;

  beforeEach(() => {
    // Mock stdout and stderr write functions
    stdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    // Restore original implementations
    stdoutWrite.mockRestore();
    stderrWrite.mockRestore();
  });

  describe('info', () => {
    it('should write message to stdout', () => {
      logger.info('test message');
      expect(stdoutWrite).toHaveBeenCalledWith('[INFO] test message\n');
    });

    it('should write message and args to stdout', () => {
      const args = { key: 'value' };
      logger.info('test message', args);
      expect(stdoutWrite).toHaveBeenCalledWith('[INFO] test message\n');
      expect(stdoutWrite).toHaveBeenCalledWith(JSON.stringify([args], null, 2) + '\n');
    });

    it('should handle multiple args', () => {
      const arg1 = { key: 'value1' };
      const arg2 = { key: 'value2' };
      logger.info('test message', arg1, arg2);
      expect(stdoutWrite).toHaveBeenCalledWith('[INFO] test message\n');
      expect(stdoutWrite).toHaveBeenCalledWith(JSON.stringify([arg1, arg2], null, 2) + '\n');
    });
  });

  describe('error', () => {
    it('should write message to stderr', () => {
      logger.error('test error');
      expect(stderrWrite).toHaveBeenCalledWith('[ERROR] test error\n');
    });

    it('should write message and args to stderr', () => {
      const args = { error: 'details' };
      logger.error('test error', args);
      expect(stderrWrite).toHaveBeenCalledWith('[ERROR] test error\n');
      expect(stderrWrite).toHaveBeenCalledWith(JSON.stringify([args], null, 2) + '\n');
    });

    it('should handle multiple args', () => {
      const arg1 = { error: 'details1' };
      const arg2 = { error: 'details2' };
      logger.error('test error', arg1, arg2);
      expect(stderrWrite).toHaveBeenCalledWith('[ERROR] test error\n');
      expect(stderrWrite).toHaveBeenCalledWith(JSON.stringify([arg1, arg2], null, 2) + '\n');
    });
  });
});
