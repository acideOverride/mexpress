import { createShellApp } from '../shell/app';
import { initializeState, resetGlobalState, subscribeToState } from '../shell/state';
import { RemoteModule } from '../shell/types';

// Mock implementations must be defined before imports
jest.mock('../shell/federation', () => {
  const mockLoadRemoteModule = jest.fn();
  const mockInitializeFederation = jest.fn();
  
  return {
    loadRemoteModule: mockLoadRemoteModule,
    initializeFederation: mockInitializeFederation,
    __mockLoadRemoteModule: mockLoadRemoteModule,
    __mockInitializeFederation: mockInitializeFederation
  };
});

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid')
}));

// Import mocked functions
const { __mockLoadRemoteModule: mockLoadRemoteModule, __mockInitializeFederation: mockInitializeFederation } = jest.requireMock('../shell/federation');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Shell Application', () => {
  let mockModule: RemoteModule;
  let mockOnStateChange: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnStateChange = jest.fn();
    mockModule = {
      mount: jest.fn().mockResolvedValue(undefined),
      unmount: jest.fn().mockResolvedValue(undefined),
      onStateChange: mockOnStateChange
    };
    mockLoadRemoteModule.mockResolvedValue(mockModule);
  });

  describe('createShellApp', () => {
    it('should initialize shell application with correct configuration', () => {
      const app = createShellApp({
        name: 'shell',
        remotes: ['dashboard', 'search']
      });

      expect(app).toBeDefined();
      expect(app.name).toBe('shell');
      expect(app.remotes).toEqual(['dashboard', 'search']);
      expect(mockInitializeFederation).toHaveBeenCalledWith(['dashboard', 'search']);
    });

    it('should throw error if no remotes are configured', () => {
      expect(() => createShellApp({ name: 'shell', remotes: [] }))
        .toThrow('Shell application requires at least one remote module');
    });

    it('should mount application and remote modules successfully', async () => {
      const app = createShellApp({
        name: 'shell',
        remotes: ['dashboard', 'search']
      });

      await app.mount();

      expect(mockLoadRemoteModule).toHaveBeenCalledTimes(2);
      expect(mockModule.mount).toHaveBeenCalledTimes(2);
      expect(mockOnStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'light',
          user: null,
          notifications: []
        })
      );
    });

    it('should handle mount failures gracefully', async () => {
      mockLoadRemoteModule.mockRejectedValueOnce(new Error('Failed to load'));

      const app = createShellApp({
        name: 'shell',
        remotes: ['dashboard']
      });

      await expect(app.mount()).rejects.toThrow('Failed to mount shell application: Failed to load');
    });

    it('should handle modules without onStateChange', async () => {
      const moduleWithoutStateChange: RemoteModule = {
        mount: jest.fn().mockResolvedValue(undefined),
        unmount: jest.fn().mockResolvedValue(undefined)
      };
      mockLoadRemoteModule.mockResolvedValueOnce(moduleWithoutStateChange);

      const app = createShellApp({
        name: 'shell',
        remotes: ['dashboard']
      });

      await app.mount();
      expect(app).toBeDefined(); // Should not throw
    });

    it('should handle modules without unmount', async () => {
      const moduleWithoutUnmount: RemoteModule = {
        mount: jest.fn().mockResolvedValue(undefined),
        onStateChange: jest.fn()
      };
      mockLoadRemoteModule.mockResolvedValueOnce(moduleWithoutUnmount);

      const app = createShellApp({
        name: 'shell',
        remotes: ['dashboard']
      });

      await app.mount();
      await app.unmount(); // Should not throw
      expect(app).toBeDefined();
    });

    it('should unmount application and remote modules successfully', async () => {
      const app = createShellApp({
        name: 'shell',
        remotes: ['dashboard', 'search']
      });

      await app.mount();
      await app.unmount();

      expect(mockModule.unmount).toHaveBeenCalledTimes(2);
    });

    it('should handle unmount failures gracefully', async () => {
      const app = createShellApp({
        name: 'shell',
        remotes: ['dashboard']
      });

      await app.mount();
      (mockModule.unmount as jest.Mock).mockRejectedValueOnce(new Error('Unmount failed'));

      await expect(app.unmount()).rejects.toThrow('Failed to unmount shell application: Unmount failed');
    });
  });

  describe('State Management', () => {
    it('should initialize global state with default values', () => {
      const state = initializeState();
      
      expect(state.getState()).toEqual({
        user: null,
        theme: 'light',
        notifications: [],
        setUser: expect.any(Function),
        setTheme: expect.any(Function),
        addNotification: expect.any(Function),
        removeNotification: expect.any(Function)
      });
    });

    it('should notify modules of state changes', async () => {
      const app = createShellApp({
        name: 'shell',
        remotes: ['dashboard']
      });

      await app.mount();
      
      // Reset mock to clear initial state notification
      mockOnStateChange.mockClear();

      const state = initializeState();
      state.getState().setTheme('dark');

      expect(mockOnStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          theme: 'dark'
        })
      );
    });

    it('should handle state subscriptions and unsubscribe', () => {
      const state = initializeState();
      const listener = jest.fn();
      
      const unsubscribe = subscribeToState(listener);
      state.getState().setTheme('dark');
      
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'dark'
        })
      );

      unsubscribe();
      state.getState().setTheme('light');
      
      // Should not be called after unsubscribe
      expect(listener).toHaveBeenCalledTimes(2); // Initial state + first change
    });

    it('should handle notifications correctly', () => {
      const state = initializeState();
      
      state.getState().addNotification({
        message: 'Test notification',
        type: 'info'
      });

      const currentState = state.getState();
      expect(currentState.notifications).toHaveLength(1);
      expect(currentState.notifications[0]).toEqual(
        expect.objectContaining({
          message: 'Test notification',
          type: 'info',
          id: 'test-uuid'
        })
      );

      state.getState().removeNotification('test-uuid');
      expect(state.getState().notifications).toHaveLength(0);
    });

    it('should handle user state changes', () => {
      const state = initializeState();
      const testUser = { id: 1, name: 'Test User' };
      
      state.getState().setUser(testUser);
      expect(state.getState().user).toEqual(testUser);

      state.getState().setUser(null);
      expect(state.getState().user).toBeNull();
    });

    it('should handle theme changes', () => {
      const state = initializeState();
      
      state.getState().setTheme('dark');
      expect(state.getState().theme).toBe('dark');

      state.getState().setTheme('light');
      expect(state.getState().theme).toBe('light');
    });

    it('should reset global state', () => {
      const state = initializeState();
      const testUser = { id: 1, name: 'Test User' };
      
      // Set some state
      state.getState().setUser(testUser);
      state.getState().setTheme('dark');
      state.getState().addNotification({
        message: 'Test notification',
        type: 'info'
      });

      // Reset state
      resetGlobalState();

      // Verify reset
      const resetState = state.getState();
      expect(resetState.user).toBeNull();
      expect(resetState.theme).toBe('light');
      expect(resetState.notifications).toHaveLength(0);
    });
  });
});