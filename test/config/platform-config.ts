import { PlatformConfig } from '../../types';

export const platformConfigs: Record<string, PlatformConfig> = {
  linux: {
    platform: 'linux',
    pathSeparator: '/',
    rootPath: '/opt/mExpress',
    testEnvironment: {
      nodeVersion: '18.x',
      testFramework: 'jest',
      coverage: true
    }
  },
  windows: {
    platform: 'windows',
    pathSeparator: '\\',
    rootPath: 'C:\\opt\\mExpress',
    testEnvironment: {
      nodeVersion: '18.x',
      testFramework: 'jest',
      coverage: true
    }
  },
  macos: {
    platform: 'macos',
    pathSeparator: '/',
    rootPath: '/opt/mExpress',
    testEnvironment: {
      nodeVersion: '18.x',
      testFramework: 'jest',
      coverage: true
    }
  }
};

export const getCurrentPlatformConfig = (): PlatformConfig => {
  const platform = process.platform;
  switch (platform) {
    case 'linux':
      return platformConfigs.linux;
    case 'win32':
      return platformConfigs.windows;
    case 'darwin':
      return platformConfigs.macos;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};