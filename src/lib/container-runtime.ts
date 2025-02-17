import { RuntimeConfig, RuntimeConfigOptions, RuntimeSpec } from '../types/runtime-config';

export class ContainerRuntime {
  private config: RuntimeSpec;

  constructor(options: RuntimeConfigOptions) {
    this.validateConfig(options);
    this.config = {
      engine: options.engine,
      version: options.version,
      rootDir: options.rootDir,
      maxContainers: options.maxContainers,
      resources: {
        memory: {
          limit: options.resources?.memory?.limit ?? '4Gi',
          reservation: options.resources?.memory?.reservation ?? '2Gi'
        },
        cpu: {
          limit: options.resources?.cpu?.limit ?? '2000m',
          shares: options.resources?.cpu?.shares ?? 1024
        },
        pids: {
          limit: options.resources?.pids?.limit ?? 1000
        }
      },
      lifecycle: {
        stopTimeout: options.lifecycle?.stopTimeout ?? 60,
        startTimeout: options.lifecycle?.startTimeout ?? 30,
        killTimeout: options.lifecycle?.killTimeout ?? 20
      }
    };
  }

  private validateConfig(options: RuntimeConfigOptions): void {
    // Validate required fields
    if (!options.engine || !options.version || !options.rootDir || options.maxContainers < 1) {
      throw new Error('Invalid runtime configuration');
    }

    // Validate lifecycle timeouts if provided
    if (options.lifecycle) {
      const { stopTimeout, startTimeout, killTimeout } = options.lifecycle;
      if (
        (stopTimeout !== undefined && stopTimeout < 0) ||
        (startTimeout !== undefined && startTimeout < 0) ||
        (killTimeout !== undefined && killTimeout < 0)
      ) {
        throw new Error('Invalid lifecycle configuration');
      }
    }

    // Validate resource limits if provided
    if (options.resources) {
      const { memory, cpu, pids } = options.resources;
      
      // Memory validation
      if (memory) {
        if (memory.limit && !memory.limit.match(/^\d+[KMGT]i$/)) {
          throw new Error('Invalid memory limit format');
        }
        if (memory.reservation && !memory.reservation.match(/^\d+[KMGT]i$/)) {
          throw new Error('Invalid memory reservation format');
        }
      }

      // CPU validation
      if (cpu) {
        if (cpu.limit && !cpu.limit.match(/^\d+m$/)) {
          throw new Error('Invalid CPU limit format');
        }
        if (cpu.shares !== undefined && cpu.shares < 2) {
          throw new Error('Invalid CPU shares');
        }
      }

      // PIDs validation
      if (pids && pids.limit !== undefined && pids.limit < 1) {
        throw new Error('Invalid PIDs limit');
      }
    }
  }

  public getRuntimeConfig(): RuntimeConfig {
    return {
      apiVersion: 'v1',
      kind: 'RuntimeConfiguration',
      spec: this.config
    };
  }
}