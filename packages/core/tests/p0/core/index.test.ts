import { bootstrap, handleBootstrapError, initializeApp, isMainModule } from '../../..';
import { logger } from '../../../utils/logger';

jest.mock('../../../utils/logger');
jest.mock('../../../utils/moduleCheck', () => ({
  isMainModule: jest.fn()
}));

describe('Application Entry Point', function() {  // Fixed syntax
  let processExitSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let originalGlobalRequire: any;

  beforeEach(() => {
    // Store original global.require
    originalGlobalRequire = (global as any).require;
    // Mock process.exit
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    // Mock console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    processExitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    // Restore global.require
    (global as any).require = originalGlobalRequire;
  });

  describe('bootstrap', () => {
    it('should log startup message', async () => {
      await bootstrap();
      expect(logger.info).toHaveBeenCalledWith('Application starting...');
    });

    it('should handle errors through handleBootstrapError', async () => {
      const mockError = new Error('Test error');
      (logger.info as jest.Mock).mockImplementation(() => {
        throw mockError;
      });
      await bootstrap().catch(handleBootstrapError);
      expect(logger.error).toHaveBeenCalledWith('Failed to start application:', mockError);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('handleBootstrapError', () => {
    it('should log error and exit', () => {
      const mockError = new Error('Test error');
      handleBootstrapError(mockError);
      expect(logger.error).toHaveBeenCalledWith('Failed to start application:', mockError);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle logging errors', () => {
      const mockError = new Error('Test error');
      const loggingError = new Error('Logging failed');
      (logger.error as jest.Mock).mockImplementation(() => {
        throw loggingError;
      });

      handleBootstrapError(mockError);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to start application:', mockError);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Additionally, logging failed:', loggingError);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('initializeApp', () => {
    it('should run when forceMain is true', async () => {
      await initializeApp(true);
      expect(logger.info).toHaveBeenCalledWith('Application starting...');
    });

    it('should not run when forceMain is false', async () => {
      await initializeApp(false);
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('should run when isMainModule returns true', async () => {
      (isMainModule as jest.Mock).mockReturnValue(true);
      await initializeApp();
      expect(logger.info).toHaveBeenCalledWith('Application starting...');
    });

    it('should not run when isMainModule returns false', async () => {
      (isMainModule as jest.Mock).mockReturnValue(false);
      await initializeApp();
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('should handle bootstrap errors', async () => {
      const mockError = new Error('Bootstrap failed');
      (logger.info as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      await initializeApp(true);
      expect(logger.error).toHaveBeenCalledWith('Failed to start application:', mockError);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should initialize when loaded as main module', async () => {
      // Mock isMainModule to return true
      (isMainModule as jest.Mock).mockReturnValue(true);
      
      // Call initializeApp directly to simulate main module behavior
      await initializeApp();
      
      // Verify initialization occurred
      expect(logger.info).toHaveBeenCalledWith('Application starting...');
    });
  });

  describe('isMainModule', () => {
    it('should be re-exported from moduleCheck', () => {
      const testModule = {};
      isMainModule(testModule as NodeModule);
      expect(require('../../../utils/moduleCheck').isMainModule).toHaveBeenCalledWith(testModule);
    });
  });
});
