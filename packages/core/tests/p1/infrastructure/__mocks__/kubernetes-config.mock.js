/**
 * Mock implementation of KubernetesConfig for testing - MEXP-2025-024-INFRA
 * This implementation doesn't require actual Kubernetes infrastructure
 * 
 * It provides testing capability for the kubernetes configuration code
 * without requiring an actual cluster deployment.
 * 
 * For P0 tests that require actual Kubernetes, use the actual implementation
 * with a real K8s cluster (use skip() when no cluster is available).
 */
class KubernetesConfig {
  constructor(options) {
    this.validateOptions(options);
    this.namespace = options.namespace;
    this.version = options.version;
    this.highAvailability = options.highAvailability;
    this.network = options.network;
    this.security = options.security;
  }

  validateOptions(options) {
    if (!options.namespace || !options.version) {
      throw new Error('Invalid cluster configuration');
    }

    if (options.network) {
      this.validateNetworkConfig(options.network);
    }
  }

  validateNetworkConfig(network) {
    const cidrPattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[1-2][0-9]|3[0-2])$/;
    if (!cidrPattern.test(network.serviceCIDR) || !cidrPattern.test(network.podCIDR)) {
      throw new Error('Invalid network configuration');
    }
  }

  getClusterConfig() {
    return {
      apiVersion: 'v1',
      kind: 'Cluster',
      metadata: {
        namespace: this.namespace
      },
      spec: {
        version: this.version,
        highAvailability: this.highAvailability,
        replicas: this.highAvailability ? 3 : 1,
        controlPlane: {
          replicas: this.highAvailability ? 3 : 1
        },
        etcd: {
          replicas: this.highAvailability ? 3 : 1
        },
        resources: {
          requests: {
            cpu: '500m',
            memory: '1Gi'
          },
          limits: {
            cpu: '1000m',
            memory: '2Gi'
          }
        },
        networking: {
          serviceCIDR: this.network?.serviceCIDR || '10.96.0.0/12',
          podCIDR: this.network?.podCIDR || '10.244.0.0/16',
          provider: 'calico'
        },
        security: {
          rbacEnabled: this.security?.rbacEnabled ?? true,
          networkPoliciesEnabled: this.security?.networkPoliciesEnabled ?? true,
          podSecurityPolicies: ['restricted'],
          networkPolicies: ['default-deny'],
          admissionControllers: ['PodSecurityPolicy'],
          auditLogging: true
        }
      }
    };
  }
}

module.exports = { KubernetesConfig };