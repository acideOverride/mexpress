/**
 * Platform-specific configuration interface
 */
export interface PlatformConfig {
  platform: 'linux' | 'windows' | 'macos';
  pathSeparator: string;
  rootPath: string;
  testEnvironment: {
    nodeVersion: string;
    testFramework: string;
    coverage: boolean;
  };
}

/**
 * Test environment configuration interface
 */
export interface TestConfig {
  silent: boolean;
  coverage: {
    enabled: boolean;
    threshold: number;
    outputFile: string;
  };
  reporters: string[];
  testMatch: string[];
  setupFiles: string[];
}

/**
 * CI/CD pipeline configuration interface
 */
export interface CIPipelineConfig {
  triggers: {
    branches: string[];
    events: string[];
  };
  stages: {
    name: string;
    steps: {
      name: string;
      command: string;
      condition?: string;
    }[];
  }[];
  environment: Record<string, string>;
}