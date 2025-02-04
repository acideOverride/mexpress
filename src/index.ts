/// <reference types="node" />
import { logger } from './utils/logger';

/**
 * Main application entry point
 */
export const bootstrap = async (): Promise<void> => {
  // Application initialization will be implemented here
  logger.info('Application starting...');
};

/**
 * Handle bootstrap errors
 */
export const handleBootstrapError = (error: Error): void => {
  try {
    logger.error('Failed to start application:', error);
  } catch (loggingError) {
    // If logging fails, at least try to write to console
    console.error('Failed to start application:', error);
    console.error('Additionally, logging failed:', loggingError);
  } finally {
    process.exit(1);
  }
};

import { isMainModule as checkIsMainModule } from './utils/moduleCheck';

// Re-export for backward compatibility
export const isMainModule = checkIsMainModule;

/**
 * Initialize application if running as main module
 */
export const initializeApp = async (forceMain?: boolean): Promise<void> => {
  // Check if we should run based on forceMain or module check
  const shouldRun = typeof forceMain === 'boolean' 
    ? forceMain 
    : isMainModule(module);

  if (shouldRun) {
    await bootstrap().catch(handleBootstrapError);
  }
};

// Run initialization if this is the main module
if (require.main === module) {
  initializeApp();
}
