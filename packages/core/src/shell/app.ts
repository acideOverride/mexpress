import { ShellConfig, ShellApp, RemoteModule, AppState } from './types';
import { initializeFederation, loadRemoteModule } from './federation';
import { useGlobalState, subscribeToState } from './state';

/**
 * Create the shell application
 * @param config Shell application configuration
 * @returns Shell application instance
 */
export const createShellApp = (config: ShellConfig): ShellApp => {
  const { name, remotes } = config;
  
  if (!remotes.length) {
    throw new Error('Shell application requires at least one remote module');
  }

  // Initialize module federation
  initializeFederation(remotes);

  // Track loaded modules
  const loadedModules: Record<string, RemoteModule> = {};

  // Track state subscribers
  const stateSubscribers: Set<(state: AppState) => void> = new Set();

  /**
   * Mount the shell application and all remote modules
   */
  const mount = async (): Promise<void> => {
    try {
      // Initialize global state
      const state = useGlobalState();
      
      // Set initial theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      state.getState().setTheme(prefersDark ? 'dark' : 'light');

      // Load and mount all remote modules
      await Promise.all(
        remotes.map(async (remoteName) => {
          const module = await loadRemoteModule(remoteName);
          loadedModules[remoteName] = module;
          await module.mount();

          // Register state change handler if module supports it
          if (module.onStateChange) {
            stateSubscribers.add(module.onStateChange);
            // Call immediately with current state
            module.onStateChange(state.getState());
          }
        })
      );

      // Set up state synchronization
      const unsubscribe = subscribeToState((newState) => {
        // Notify all subscribers of state changes
        stateSubscribers.forEach(subscriber => {
          subscriber(newState);
        });
      });

      // Store unsubscribe function for cleanup
      (loadedModules as any)._stateUnsubscribe = unsubscribe;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to mount shell application: ${errorMessage}`);
    }
  };

  /**
   * Unmount the shell application and all remote modules
   */
  const unmount = async (): Promise<void> => {
    try {
      // Clear state subscribers
      stateSubscribers.clear();

      // Unsubscribe from state changes
      if ((loadedModules as any)._stateUnsubscribe) {
        (loadedModules as any)._stateUnsubscribe();
      }

      // Unmount all remote modules in reverse order
      await Promise.all(
        Object.entries(loadedModules)
          .reverse()
          .map(async ([remoteName, module]) => {
            if (module.unmount) {
              await module.unmount();
            }
            delete loadedModules[remoteName];
          })
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to unmount shell application: ${errorMessage}`);
    }
  };

  return {
    name,
    remotes,
    mount,
    unmount
  };
};