import { KubernetesConfig } from '../../lib/kubernetes-config';
import { ClusterConfig } from '../../types/cluster-config';

describe('KubernetesConfig', () => {
  describe('Cluster Setup', () => {
    let config: KubernetesConfig;
    
    beforeEach(() => {
      config = new KubernetesConfig({
        namespace: 'mexpress',
        version: 'v1.24',
        highAvailability: true
      });
    });

    test('should create valid cluster configuration', () => {
      const clusterConfig = config.getClusterConfig();
      expect(clusterConfig.apiVersion).toBe('v1');
      expect(clusterConfig.kind).toBe('Cluster');
      expect(clusterConfig.metadata.namespace).toBe('mexpress');
      expect(clusterConfig.spec.version).toBe('v1.24');
      expect(clusterConfig.spec.highAvailability).toBe(true);
    });

    test('should throw error for invalid configuration', () => {
      expect(() => new KubernetesConfig({
        namespace: '',
        version: '',
        highAvailability: false
      })).toThrow('Invalid cluster configuration');
    });

    test('should configure high availability settings', () => {
      const clusterConfig = config.getClusterConfig();
      expect(clusterConfig.spec.replicas).toBeGreaterThanOrEqual(3);
      expect(clusterConfig.spec.controlPlane.replicas).toBe(3);
      expect(clusterConfig.spec.etcd.replicas).toBe(3);
    });

    test('should validate resource requirements', () => {
      const clusterConfig = config.getClusterConfig();
      expect(clusterConfig.spec.resources.requests.cpu).toBeDefined();
      expect(clusterConfig.spec.resources.requests.memory).toBeDefined();
      expect(clusterConfig.spec.resources.limits.cpu).toBeDefined();
      expect(clusterConfig.spec.resources.limits.memory).toBeDefined();
    });
  });

  describe('Network Configuration', () => {
    let config: KubernetesConfig;
    
    beforeEach(() => {
      config = new KubernetesConfig({
        namespace: 'mexpress',
        version: 'v1.24',
        highAvailability: true,
        network: {
          serviceCIDR: '10.96.0.0/12',
          podCIDR: '10.244.0.0/16'
        }
      });
    });

    test('should configure network settings', () => {
      const clusterConfig = config.getClusterConfig();
      expect(clusterConfig.spec.networking.serviceCIDR).toBe('10.96.0.0/12');
      expect(clusterConfig.spec.networking.podCIDR).toBe('10.244.0.0/16');
      expect(clusterConfig.spec.networking.provider).toBe('calico');
    });

    test('should validate network configuration', () => {
      expect(() => new KubernetesConfig({
        namespace: 'mexpress',
        version: 'v1.24',
        highAvailability: true,
        network: {
          serviceCIDR: 'invalid',
          podCIDR: 'invalid'
        }
      })).toThrow('Invalid network configuration');
    });
  });

  describe('Security Configuration', () => {
    let config: KubernetesConfig;
    
    beforeEach(() => {
      config = new KubernetesConfig({
        namespace: 'mexpress',
        version: 'v1.24',
        highAvailability: true,
        security: {
          rbacEnabled: true,
          networkPoliciesEnabled: true
        }
      });
    });

    test('should configure security settings', () => {
      const clusterConfig = config.getClusterConfig();
      expect(clusterConfig.spec.security.rbacEnabled).toBe(true);
      expect(clusterConfig.spec.security.networkPoliciesEnabled).toBe(true);
      expect(clusterConfig.spec.security.admissionControllers).toContain('PodSecurityPolicy');
    });

    test('should enforce security policies', () => {
      const clusterConfig = config.getClusterConfig();
      expect(clusterConfig.spec.security.podSecurityPolicies).toBeDefined();
      expect(clusterConfig.spec.security.networkPolicies).toBeDefined();
      expect(clusterConfig.spec.security.auditLogging).toBe(true);
    });
  });
});