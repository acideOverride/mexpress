import { AppState } from './types';
import { v4 as uuidv4 } from 'uuid';

const createStore = (): AppState => {
  const store: AppState = {
    user: null,
    theme: 'light' as const,
    notifications: [],
    setUser: function(user) {
      store.user = user;
      notifySubscribers(store);
    },
    setTheme: function(theme) {
      store.theme = theme;
      notifySubscribers(store);
    },
    addNotification: function(notification) {
      store.notifications = [
        ...store.notifications,
        {
          ...notification,
          id: uuidv4()
        }
      ];
      notifySubscribers(store);
    },
    removeNotification: function(id) {
      store.notifications = store.notifications.filter((n) => n.id !== id);
      notifySubscribers(store);
    }
  };
  return store;
};

type StoreApi = {
  getState: () => AppState;
  setState: (fn: (state: AppState) => Partial<AppState>) => void;
  subscribe: (listener: (state: AppState) => void) => () => void;
};

// Global subscribers set
const subscribers = new Set<(state: AppState) => void>();

// Notify all subscribers of state changes
const notifySubscribers = (state: AppState) => {
  subscribers.forEach(subscriber => subscriber(state));
};

export const initializeState = (): StoreApi => {
  const store = createStore();

  return {
    getState: () => store,
    setState: (fn: (state: AppState) => Partial<AppState>) => {
      const updates = fn(store);
      Object.assign(store, updates);
      notifySubscribers(store);
    },
    subscribe: (listener: (state: AppState) => void) => {
      subscribers.add(listener);
      // Call immediately with current state
      listener(store);
      return () => {
        subscribers.delete(listener);
      };
    }
  };
};

// Create a singleton instance for global state
const globalState = initializeState();

/**
 * Get the global state instance
 * @returns Global state store
 */
export const useGlobalState = () => globalState;

/**
 * Subscribe to state changes
 * @param callback Function to call when state changes
 * @returns Unsubscribe function
 */
export const subscribeToState = (callback: (state: AppState) => void) => {
  return globalState.subscribe(callback);
};

/**
 * Reset the global state to its initial values
 */
export const resetGlobalState = () => {
  // Create fresh store with initial values
  const freshStore = createStore();
  // Apply fresh state atomically
  globalState.setState(() => ({
    user: freshStore.user,
    theme: freshStore.theme,
    notifications: freshStore.notifications
  }));
};