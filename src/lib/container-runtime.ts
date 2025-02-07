import { RuntimeConfig, RuntimeConfigOptions } from '../types/runtime-config';

export class ContainerRuntime {
  private engine: string;
  private version: string;
  private rootDir: string;
  private maxContainers: number;
  private lifecycle?: {
    stopTimeout?: number;
    startTimeout?: number;
    killTimeout?: number;
  };

  constructor(options: RuntimeConfigOptions) {
    this.validateOptions(options);
    this.engine = options.engine;
    this.version = options.version;
    this.rootDir = options.rootDir;
    this.maxContainers = options.maxContainers;
    this.lifecycle = options.lifecycle;
  }

  private validateOptions(options: RuntimeConfigOptions): void {
    if (!options.engine || !options.version || !options.rootDir || options.maxContainers < 0) {
      throw new Error('Invalid runtime configuration');
    }

    if (options.lifecycle) {
      this.validateLifecycleConfig(options.lifecycle);
    }
  }

  private validateLifecycleConfig(lifecycle: { stopTimeout?: number; startTimeout?: number; killTimeout?: number }): void {
    if (
      (lifecycle.stopTimeout !== undefined && lifecycle.stopTimeout < 0) ||
      (lifecycle.startTimeout !== undefined && lifecycle.startTimeout < 0) ||
      (lifecycle.killTimeout !== undefined && lifecycle.killTimeout < 0)
    ) {
      throw new Error('Invalid lifecycle configuration');
    }
  }

  public getRuntimeConfig(): RuntimeConfig {
    return {
      apiVersion: 'v1',
      kind: 'RuntimeConfiguration',
      spec: {
        engine: this.engine,
        version: this.version,
        rootDir: this.rootDir,
        maxContainers: this.maxContainers,
        resources: {
          memory: {
            limit: '4Gi',
            reservation: '2Gi'
          },
          cpu: {
            limit: '2000m',
            shares: 1024
          },
          pids: {
            limit: 1000
          }
        },
        lifecycle: {
          stopTimeout: this.lifecycle?.stopTimeout ?? 60,
          startTimeout: this.lifecycle?.startTimeout ?? 30,
          killTimeout: this.lifecycle?.killTimeout ?? 20
        }
      }
    };
  }
}