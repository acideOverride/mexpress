export interface ShellConfig {
  name: string;
  remotes: string[];
}

export interface RemoteModule {
  mount: () => Promise<void>;
  unmount?: () => Promise<void>;
  onStateChange?: (state: AppState) => void;
}

export interface User {
  id: number;
  name: string;
}

export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
}

export interface ShellApp {
  name: string;
  remotes: string[];
  mount: () => Promise<void>;
  unmount: () => Promise<void>;
}

// Performance metrics types
export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  memoryUsage: number;
}

// Module federation types
export interface RemoteModuleConfig {
  name: string;
  url: string;
  scope: string;
  module: string;
}

export interface FederationConfig {
  remotes: RemoteModuleConfig[];
  shared: Record<string, string>;
}