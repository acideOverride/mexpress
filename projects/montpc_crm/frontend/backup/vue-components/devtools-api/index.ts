// DevTools API proxy with simple mock implementation
// Define basic interface for setupDevtoolsPlugin function
export function setupDevtoolsPlugin(pluginDescriptor: any, setupFn: any): void {
  // This is a no-op implementation that prevents runtime errors
  console.log('DevTools plugin setup (mock):', pluginDescriptor?.id || 'unknown');
}

// Export any other needed types/functions as basic mocks
export const DevtoolsPluginApi = {};

// Add specific types needed by consumers
export interface DevtoolsHook {
  emit: (event: string, ...payload: any[]) => void;
  on: (event: string, callback: Function) => void;
  once: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
}

export interface App {
  _instance: any;
  version: string;
}

export interface ComponentInstance {
  type: any;
  uid: number;
}

export type ComponentState = {
  type: string;
  key: string;
  value: any;
};
