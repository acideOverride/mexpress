import { RemoteModule, RemoteModuleConfig } from './types';

const remoteModuleRegistry: Record<string, () => Promise<RemoteModule>> = {};

/**
 * Dynamically load a remote entry script
 * @param url Remote entry URL
 * @returns Promise that resolves when script is loaded
 */
export const loadRemoteEntry = async (url: string): Promise<void> => {
  if (!url) throw new Error('URL is required');

  return new Promise((resolve, reject) => {
    let script: HTMLScriptElement;
    try {
      script = document.createElement('script');
      if (!script) throw new Error('Failed to create script element');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reject(new Error(`Failed to create script element: ${errorMessage}`));
      return;
    }

    script.src = url;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load remote entry script: ${url}`));

    try {
      document.head.appendChild(script);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reject(new Error(`Failed to create script element: ${errorMessage}`));
    }
  });
};

/**
 * Initialize webpack module federation container
 * @param scope Container scope
 * @returns Promise resolving to the container
 */
const initContainer = async (scope: string): Promise<any> => {
  if (!scope) throw new Error('Container scope is required');

  try {
    // Initialize sharing scope
    await __webpack_init_sharing__('default');
    
    // Get the container
    const container = (window as any)[scope];
    if (!container) {
      throw new Error(`Container ${scope} not found`);
    }

    if (typeof container.init !== 'function') {
      throw new Error(`Container ${scope} does not implement required init method`);
    }

    // Initialize container
    await container.init(__webpack_share_scopes__.default);

    if (typeof container.get !== 'function') {
      throw new Error(`Container ${scope} does not implement required get method`);
    }
    
    return container;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to initialize container: ${errorMessage}`);
  }
};

/**
 * Register a remote module for later use
 * @param name Remote module name
 * @param loadFn Function to load the remote module
 */
export const registerRemoteModule = (
  name: string,
  loadFn: () => Promise<RemoteModule>
): void => {
  if (!name || typeof name !== 'string') {
    throw new Error('Module name is required');
  }
  if (typeof loadFn !== 'function') {
    throw new Error('Load function is required');
  }
  remoteModuleRegistry[name] = loadFn;
};

/**
 * Load a remote module by name
 * @param name Remote module name
 * @returns Promise resolving to the remote module
 * @throws Error if module is not registered or fails to load
 */
export const loadRemoteModule = async (name: string): Promise<RemoteModule> => {
  if (!name || typeof name !== 'string') {
    throw new Error('Module name is required');
  }

  const loadFn = remoteModuleRegistry[name];
  if (!loadFn) {
    throw new Error(`Remote module "${name}" not registered`);
  }

  try {
    const module = await loadFn();
    
    if (!module || typeof module !== 'object' || typeof module.mount !== 'function') {
      throw new Error(`Invalid module instance returned from factory`);
    }

    return module;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to load remote module "${name}": ${errorMessage}`);
  }
};

/**
 * Initialize module federation system
 * @param remotes List of remote module names
 */
export const initializeFederation = (remotes: string[]): void => {
  if (!Array.isArray(remotes)) {
    throw new Error('Remotes must be an array');
  }

  // Clear existing registry
  Object.keys(remoteModuleRegistry).forEach(key => {
    delete remoteModuleRegistry[key];
  });

  // Register remote entry points
  remotes.forEach(remote => {
    if (!remote || typeof remote !== 'string') {
      throw new Error('Remote name must be a non-empty string');
    }

    const config: RemoteModuleConfig = {
      name: remote,
      url: `http://localhost:3001/${remote}/remoteEntry.js`,
      scope: remote,
      module: './Module'
    };

    registerRemoteModule(remote, async () => {
      try {
        await loadRemoteEntry(config.url);
        const container = await initContainer(config.scope);
        const factory = await container.get(config.module);

        if (!factory) throw new Error(`Invalid factory returned for module ${config.module}`);
        if (typeof factory !== 'function') throw new Error(`Invalid factory returned for module ${config.module}`);

        const module = await factory();
        if (!module || typeof module !== 'object' || typeof module.mount !== 'function') {
          throw new Error(`Invalid module instance returned from factory`);
        }

        return module;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(errorMessage);
      }
    });
  });
};

/**
 * Get list of registered remote modules
 * @returns Array of registered remote module names
 */
export const getRegisteredRemotes = (): string[] => {
  return Object.keys(remoteModuleRegistry);
};

/**
 * Check if a remote module is registered
 * @param name Remote module name
 * @returns boolean indicating if module is registered
 */
export const isRemoteRegistered = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  return name in remoteModuleRegistry;
};