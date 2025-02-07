import { ContainerRuntime } from '../../lib/container-runtime';
import { RuntimeConfig } from '../../types/runtime-config';

describe('ContainerRuntime', () => {
  describe('Runtime Setup', () => {
    let runtime: ContainerRuntime;
    
    beforeEach(() => {
      runtime = new ContainerRuntime({
        engine: 'containerd',
        version: '1.6',
        rootDir: '/var/lib/containerd',
        maxContainers: 1000
      });
    });

    test('should create valid runtime configuration', () => {
      const config = runtime.getRuntimeConfig();
      expect(config.apiVersion).toBe('v1');
      expect(config.kind).toBe('RuntimeConfiguration');
      expect(config.spec.engine).toBe('containerd');
      expect(config.spec.version).toBe('1.6');
      expect(config.spec.rootDir).toBe('/var/lib/containerd');
      expect(config.spec.maxContainers).toBe(1000);
    });

    test('should throw error for invalid configuration', () => {
      expect(() => new ContainerRuntime({
        engine: '',
        version: '',
        rootDir: '',
        maxContainers: -1
      })).toThrow('Invalid runtime configuration');
    });

    test('should validate resource limits', () => {
      const config = runtime.getRuntimeConfig();
      expect(config.spec.resources.memory.limit).toBe('4Gi');
      expect(config.spec.resources.cpu.limit).toBe('2000m');
      expect(config.spec.resources.pids.limit).toBe(1000);
      expect(config.spec.resources.memory.reservation).toBe('2Gi');
    });
  });

  describe('Container Management', () => {
    let runtime: ContainerRuntime;
    
    beforeEach(() => {
      runtime = new ContainerRuntime({
        engine: 'containerd',
        version: '1.6',
        rootDir: '/var/lib/containerd',
        maxContainers: 1000,
        lifecycle: {
          stopTimeout: 30,
          startTimeout: 20,
          killTimeout: 10
        }
      });
    });

    test('should configure container lifecycle', () => {
      const config = runtime.getRuntimeConfig();
      expect(config.spec.lifecycle.stopTimeout).toBe(30);
      expect(config.spec.lifecycle.startTimeout).toBe(20);
      expect(config.spec.lifecycle.killTimeout).toBe(10);
    });

    test('should use default lifecycle values if not provided', () => {
      const defaultRuntime = new ContainerRuntime({
        engine: 'containerd',
        version: '1.6',
        rootDir: '/var/lib/containerd',
        maxContainers: 1000
      });
      const config = defaultRuntime.getRuntimeConfig();
      expect(config.spec.lifecycle.stopTimeout).toBe(60);
      expect(config.spec.lifecycle.startTimeout).toBe(30);
      expect(config.spec.lifecycle.killTimeout).toBe(20);
    });

    test('should validate lifecycle timeouts', () => {
      expect(() => new ContainerRuntime({
        engine: 'containerd',
        version: '1.6',
        rootDir: '/var/lib/containerd',
        maxContainers: 1000,
        lifecycle: {
          stopTimeout: -1,
          startTimeout: -1,
          killTimeout: -1
        }
      })).toThrow('Invalid lifecycle configuration');
    });
  });
});