/**
 * Pinia Plugin Configuration
 * Configures Pinia for use in the application
 */

import { createPinia } from 'pinia';

/**
 * Creates and configures a Pinia instance for the application
 * @returns Configured Pinia instance
 */
export function setupPinia() {
  const pinia = createPinia();
  
  // Add any plugins or extensions here
  // Example: pinia.use(piniaPluginPersistedstate)
  
  return pinia;
}

// Export a default pinia instance for direct use
export const pinia = setupPinia();