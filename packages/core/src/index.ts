import { logger } from './utils/logger';
import { isMainModule } from './utils/moduleCheck';

/**
 * Bootstrap the application
 */
export async function bootstrap(): Promise<void> {
    logger.info('Application starting...');
    // Additional initialization logic can be added here
}

/**
 * Handle bootstrap errors
 * @param error The error that occurred during bootstrap
 */
export function handleBootstrapError(error: Error): void {
    try {
        logger.error('Failed to start application:', error);
    } catch (loggingError) {
        console.error('Failed to start application:', error);
        console.error('Additionally, logging failed:', loggingError);
    }
    process.exit(1);
}

/**
 * Initialize the application
 * @param forceMain Force initialization even if not main module
 */
export async function initializeApp(forceMain?: boolean): Promise<void> {
    // Run only if forced or if this is the main module
    if (forceMain || isMainModule(module)) {
        try {
            await bootstrap();
        } catch (error) {
            handleBootstrapError(error as Error);
        }
    }
}

// Re-export isMainModule for convenience
export { isMainModule } from './utils/moduleCheck';

// Auto-initialize if this is the main module
if (isMainModule(module)) {
    initializeApp().catch(handleBootstrapError);
}
