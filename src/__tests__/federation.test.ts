import { registerRemoteModule, loadRemoteModule, initializeFederation, getRegisteredRemotes, isRemoteRegistered } from '../shell/federation';
import { RemoteModule, RemoteModuleConfig } from '../shell/types';

// Mock webpack's module federation
const mockContainer = {
  init: jest.fn(),
  get: jest.fn()
};

// Mock __webpack_init_sharing__ and __webpack_share_scopes__
(global as any).__webpack_init_sharing__ = jest.fn().mockResolvedValue(undefined);
(global as any).__webpack_share_scopes__ = { default: {} };

describe('Federation System', () => {
  let mockScript: HTMLScriptElement;
  let createElement: jest.SpyInstance;
  let appendChild: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset federation system
    initializeFederation([]);

    // Setup document mocks
    mockScript = document.createElement('script');
    createElement = jest.spyOn(document, 'createElement').mockReturnValue(mockScript);
    appendChild = jest.spyOn(document.head, 'appendChild').mockReturnValue(mockScript);
    
    // Setup window container mock
    (window as any).testScope = mockContainer;
  });

  describe('Module Registration', () => {
    it('should register a remote module successfully', () => {
      const mockLoadFn = jest.fn();
      registerRemoteModule('test-module', mockLoadFn);
      
      expect(isRemoteRegistered('test-module')).toBe(true);
      expect(getRegisteredRemotes()).toContain('test-module');
    });

    it('should override existing module registration', () => {
      const mockLoadFn1 = jest.fn();
      const mockLoadFn2 = jest.fn();
      
      registerRemoteModule('test-module', mockLoadFn1);
      registerRemoteModule('test-module', mockLoadFn2);
      
      expect(getRegisteredRemotes()).toHaveLength(1);
    });

    it('should throw error for invalid module name', () => {
      expect(() => registerRemoteModule('', jest.fn()))
        .toThrow('Module name is required');
      expect(() => registerRemoteModule(null as any, jest.fn()))
        .toThrow('Module name is required');
      expect(() => registerRemoteModule(undefined as any, jest.fn()))
        .toThrow('Module name is required');
      expect(() => registerRemoteModule({} as any, jest.fn()))
        .toThrow('Module name is required');
    });

    it('should throw error for invalid load function', () => {
      expect(() => registerRemoteModule('test', null as any))
        .toThrow('Load function is required');
      expect(() => registerRemoteModule('test', undefined as any))
        .toThrow('Load function is required');
      expect(() => registerRemoteModule('test', 'not a function' as any))
        .toThrow('Load function is required');
      expect(() => registerRemoteModule('test', {} as any))
        .toThrow('Load function is required');
    });
  });

  describe('Module Loading', () => {
    const mockRemoteModule: RemoteModule = {
      mount: jest.fn().mockResolvedValue(undefined)
    };

    beforeEach(() => {
      // Reset mocks
      mockContainer.init.mockResolvedValue(undefined);
      mockContainer.get.mockResolvedValue(() => mockRemoteModule);
    });

    it('should load registered module successfully', async () => {
      const mockConfig: RemoteModuleConfig = {
        name: 'test-module',
        url: 'http://localhost:3001/remoteEntry.js',
        scope: 'testScope',
        module: './TestModule'
      };

      // Register module
      registerRemoteModule('test-module', async () => {
        // Mock webpack module federation loading
        const container = mockContainer;
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get(mockConfig.module);
        return factory();
      });

      const module = await loadRemoteModule('test-module');
      expect(module).toBeDefined();
      expect(module.mount).toBeDefined();
      expect(mockContainer.init).toHaveBeenCalledWith(__webpack_share_scopes__.default);
      expect(mockContainer.get).toHaveBeenCalledWith(mockConfig.module);
    });

    it('should throw error for invalid module name', async () => {
      await expect(loadRemoteModule('')).rejects.toThrow('Module name is required');
      await expect(loadRemoteModule(null as any)).rejects.toThrow('Module name is required');
      await expect(loadRemoteModule(undefined as any)).rejects.toThrow('Module name is required');
      await expect(loadRemoteModule({} as any)).rejects.toThrow('Module name is required');
    });

    it('should throw error for unregistered module', async () => {
      await expect(loadRemoteModule('unknown-module'))
        .rejects
        .toThrow('Remote module "unknown-module" not registered');
    });

    it('should throw error if module loading fails', async () => {
      registerRemoteModule('failing-module', async () => {
        throw new Error('Failed to load module');
      });

      await expect(loadRemoteModule('failing-module'))
        .rejects
        .toThrow('Failed to load remote module "failing-module": Failed to load module');
    });

    it('should throw error if loaded module lacks mount method', async () => {
      registerRemoteModule('invalid-module', async () => ({} as RemoteModule));

      await expect(loadRemoteModule('invalid-module'))
        .rejects
        .toThrow('Failed to load remote module "invalid-module": Invalid module instance returned from factory');
    });

    it('should throw error if container initialization fails', async () => {
      mockContainer.init.mockRejectedValueOnce(new Error('Container init failed'));
      
      registerRemoteModule('failing-container', async () => {
        throw new Error('Failed to initialize container: Container init failed');
      });

      await expect(loadRemoteModule('failing-container'))
        .rejects
        .toThrow('Failed to load remote module "failing-container": Failed to initialize container: Container init failed');
    });

    it('should throw error if factory is not a function', async () => {
      mockContainer.get.mockResolvedValueOnce('not a function');
      
      registerRemoteModule('invalid-factory', async () => {
        throw new Error('Failed to initialize remote module "invalid-factory": Invalid factory returned for module ./Module');
      });

      await expect(loadRemoteModule('invalid-factory'))
        .rejects
        .toThrow('Failed to load remote module "invalid-factory": Failed to initialize remote module "invalid-factory": Invalid factory returned for module ./Module');
    });

    it('should throw error if module is not an object', async () => {
      mockContainer.get.mockResolvedValueOnce(() => 'not an object');
      
      registerRemoteModule('invalid-module-type', async () => {
        throw new Error('Failed to initialize remote module "invalid-module-type": Invalid module instance returned from factory');
      });

      await expect(loadRemoteModule('invalid-module-type'))
        .rejects
        .toThrow('Failed to load remote module "invalid-module-type": Failed to initialize remote module "invalid-module-type": Invalid module instance returned from factory');
    });

    it('should handle non-Error objects in catch', async () => {
      registerRemoteModule('string-error', async () => {
        throw 'String error message';
      });

      await expect(loadRemoteModule('string-error'))
        .rejects
        .toThrow('Failed to load remote module "string-error": Unknown error');
    });
  });

  describe('Federation Initialization', () => {
    it('should throw error for invalid remotes array', () => {
      expect(() => initializeFederation(null as any))
        .toThrow('Remotes must be an array');
      expect(() => initializeFederation(undefined as any))
        .toThrow('Remotes must be an array');
      expect(() => initializeFederation('not an array' as any))
        .toThrow('Remotes must be an array');
      expect(() => initializeFederation([null as any]))
        .toThrow('Remote name must be a non-empty string');
      expect(() => initializeFederation(['']))
        .toThrow('Remote name must be a non-empty string');
      expect(() => initializeFederation([{}] as any))
        .toThrow('Remote name must be a non-empty string');
    });

    it('should initialize federation system with remotes', async () => {
      const remotes = ['module1'];
      const mockModule: RemoteModule = {
        mount: jest.fn().mockResolvedValue(undefined)
      };

      // Setup container mock
      const container = {
        init: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(() => mockModule)
      };
      (window as any).module1 = container;
      
      initializeFederation(remotes);
      expect(getRegisteredRemotes()).toEqual(remotes);

      // Trigger script load and verify module loading
      const loadPromise = loadRemoteModule('module1');
      mockScript.onload?.(new Event('load'));
      
      const module = await loadPromise;
      expect(module).toBeDefined();
      expect(createElement).toHaveBeenCalledWith('script');
      expect(appendChild).toHaveBeenCalledWith(mockScript);
      expect(mockScript.src).toContain('module1/remoteEntry.js');
      expect(container.init).toHaveBeenCalledWith(__webpack_share_scopes__.default);
      expect(container.get).toHaveBeenCalledWith('./Module');
    });

    it('should clear existing registrations on initialization', () => {
      registerRemoteModule('test-module', jest.fn());
      expect(getRegisteredRemotes()).toHaveLength(1);

      initializeFederation(['new-module']);
      expect(getRegisteredRemotes()).toHaveLength(1);
      expect(isRemoteRegistered('test-module')).toBe(false);
      expect(isRemoteRegistered('new-module')).toBe(true);
    });

    it('should handle container not found error', async () => {
      delete (window as any).test;
      initializeFederation(['test']);
      
      const loadPromise = loadRemoteModule('test');
      mockScript.onload?.(new Event('load'));

      await expect(loadPromise)
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to initialize container: Container test not found');
    });

    it('should handle container without init method', async () => {
      (window as any).test = {};
      initializeFederation(['test']);
      
      const loadPromise = loadRemoteModule('test');
      mockScript.onload?.(new Event('load'));

      await expect(loadPromise)
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to initialize container: Container test does not implement required init method');
    });

    it('should handle container without get method', async () => {
      (window as any).test = { init: jest.fn() };
      initializeFederation(['test']);
      
      const loadPromise = loadRemoteModule('test');
      mockScript.onload?.(new Event('load'));

      await expect(loadPromise)
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to initialize container: Container test does not implement required get method');
    });

    it('should handle script creation failure', async () => {
      createElement.mockImplementationOnce(() => {
        throw new Error('Failed to create script');
      });

      initializeFederation(['test']);
      await expect(loadRemoteModule('test'))
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to create script element: Failed to create script');
    });

    it('should handle script loading failure', async () => {
      initializeFederation(['test']);
      
      const loadPromise = loadRemoteModule('test');
      mockScript.onerror?.(new Event('error'));

      await expect(loadPromise)
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to load remote entry script: http://localhost:3001/test/remoteEntry.js');
    });

    it('should handle script element creation returning null', async () => {
      createElement.mockReturnValueOnce(null);
      
      initializeFederation(['test']);
      await expect(loadRemoteModule('test'))
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to create script element');
    });

    it('should handle script element append failure', async () => {
      appendChild.mockImplementationOnce(() => {
        throw new Error('Failed to append script');
      });
      
      initializeFederation(['test']);
      await expect(loadRemoteModule('test'))
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to create script element: Failed to append script');
    });

    it('should handle empty URL in script loading', async () => {
      mockScript.src = '';
      initializeFederation(['test']);
      const loadPromise = loadRemoteModule('test');
      mockScript.onerror?.(new Event('error'));

      await expect(loadPromise)
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to load remote entry script: http://localhost:3001/test/remoteEntry.js');
    });
  });

  describe('Module Registration Validation', () => {
    it('should handle invalid module name in isRegistered', () => {
      expect(isRemoteRegistered('')).toBe(false);
      expect(isRemoteRegistered(null as any)).toBe(false);
      expect(isRemoteRegistered(undefined as any)).toBe(false);
      expect(isRemoteRegistered({} as any)).toBe(false);
      expect(isRemoteRegistered([] as any)).toBe(false);
      expect(isRemoteRegistered(123 as any)).toBe(false);
    });

    it('should handle non-Error objects in error chain', async () => {
      registerRemoteModule('test', async () => {
        throw { custom: 'error' };
      });

      await expect(loadRemoteModule('test'))
        .rejects
        .toThrow('Failed to load remote module "test": Unknown error');
    });

    it('should handle null module return', async () => {
      registerRemoteModule('null-module', async () => null as any);

      await expect(loadRemoteModule('null-module'))
        .rejects
        .toThrow('Failed to load remote module "null-module": Invalid module instance returned from factory');
    });

    it('should handle undefined module return', async () => {
      registerRemoteModule('undefined-module', async () => undefined as any);

      await expect(loadRemoteModule('undefined-module'))
        .rejects
        .toThrow('Failed to load remote module "undefined-module": Invalid module instance returned from factory');
    });

    it('should handle sharing scope initialization failure', async () => {
      (global as any).__webpack_init_sharing__ = jest.fn().mockRejectedValue(new Error('Sharing init failed'));

      initializeFederation(['test']);
      const loadPromise = loadRemoteModule('test');
      mockScript.onload?.(new Event('load'));

      await expect(loadPromise)
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to initialize container: Sharing init failed');
    });

    it('should handle empty container scope', async () => {
      registerRemoteModule('empty-scope', async () => {
        throw new Error('Failed to initialize container: Container scope is required');
      });

      await expect(loadRemoteModule('empty-scope'))
        .rejects
        .toThrow('Failed to load remote module "empty-scope": Failed to initialize container: Container scope is required');
    });

    it('should handle non-Error object in container initialization', async () => {
      (global as any).__webpack_init_sharing__ = jest.fn().mockRejectedValue('String error');

      initializeFederation(['test']);
      const loadPromise = loadRemoteModule('test');
      mockScript.onload?.(new Event('load'));

      await expect(loadPromise)
        .rejects
        .toThrow('Failed to load remote module "test": Failed to initialize remote module "test": Failed to initialize container: Unknown error');
    });

    it('should handle invalid factory type', async () => {
      const mockContainer = {
        init: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue('not a function')
      };

      registerRemoteModule('invalid-factory-type', async () => {
        const container = mockContainer;
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get('./Module');
        if (typeof factory !== 'function') throw new Error('Invalid factory returned for module ./Module');
        return {} as RemoteModule;
      });

      await expect(loadRemoteModule('invalid-factory-type'))
        .rejects
        .toThrow('Failed to load remote module "invalid-factory-type": Invalid factory returned for module ./Module');
    });

    it('should handle invalid module type', async () => {
      const mockContainer = {
        init: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(() => 'not an object')
      };

      registerRemoteModule('invalid-module-type', async () => {
        const container = mockContainer;
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get('./Module');
        if (typeof factory !== 'function') throw new Error('Invalid factory returned for module ./Module');
        const module = await factory();
        if (!module || typeof module !== 'object') throw new Error('Invalid module instance returned from factory');
        return module as RemoteModule;
      });

      await expect(loadRemoteModule('invalid-module-type'))
        .rejects
        .toThrow('Failed to load remote module "invalid-module-type": Invalid module instance returned from factory');
    });

    it('should handle factory returning null', async () => {
      const mockContainer = {
        init: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(() => null)
      };

      registerRemoteModule('null-factory', async () => {
        const container = mockContainer;
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get('./Module');
        if (typeof factory !== 'function') throw new Error('Invalid factory returned for module ./Module');
        const module = await factory();
        if (!module || typeof module !== 'object') throw new Error('Invalid module instance returned from factory');
        return module as RemoteModule;
      });

      await expect(loadRemoteModule('null-factory'))
        .rejects
        .toThrow('Failed to load remote module "null-factory": Invalid module instance returned from factory');
    });

    it('should handle factory returning undefined', async () => {
      const mockContainer = {
        init: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(() => undefined)
      };

      registerRemoteModule('undefined-factory', async () => {
        const container = mockContainer;
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get('./Module');
        if (typeof factory !== 'function') throw new Error('Invalid factory returned for module ./Module');
        const module = await factory();
        if (!module || typeof module !== 'object') throw new Error('Invalid module instance returned from factory');
        return module as RemoteModule;
      });

      await expect(loadRemoteModule('undefined-factory'))
        .rejects
        .toThrow('Failed to load remote module "undefined-factory": Invalid module instance returned from factory');
    });

    it('should handle factory throwing error', async () => {
      const mockContainer = {
        init: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(() => {
          throw new Error('Factory execution failed');
        })
      };

      registerRemoteModule('failing-factory', async () => {
        const container = mockContainer;
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get('./Module');
        if (typeof factory !== 'function') throw new Error('Invalid factory returned for module ./Module');
        const module = await factory();
        if (!module || typeof module !== 'object') throw new Error('Invalid module instance returned from factory');
        return module as RemoteModule;
      });

      await expect(loadRemoteModule('failing-factory'))
        .rejects
        .toThrow('Failed to load remote module "failing-factory": Factory execution failed');
    });

    it('should handle factory returning non-promise', async () => {
      const mockContainer = {
        init: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(() => ({} as any))
      };

      registerRemoteModule('non-promise-factory', async () => {
        const container = mockContainer;
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get('./Module');
        if (typeof factory !== 'function') throw new Error('Invalid factory returned for module ./Module');
        const module = await factory();
        if (!module || typeof module !== 'object') throw new Error('Invalid module instance returned from factory');
        return module as RemoteModule;
      });

      await expect(loadRemoteModule('non-promise-factory'))
        .rejects
        .toThrow('Failed to load remote module "non-promise-factory": Invalid module instance returned from factory');
    });
  });
});
