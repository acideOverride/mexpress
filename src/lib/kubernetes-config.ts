import { ClusterConfig, KubernetesConfigOptions } from '../types/cluster-config';

export class KubernetesConfig {
  private namespace: string;
  private version: string;
  private highAvailability: boolean;
  private network?: {
    serviceCIDR: string;
    podCIDR: string;
  };
  private security?: {
    rbacEnabled: boolean;
    networkPoliciesEnabled: boolean;
  };

  constructor(options: KubernetesConfigOptions) {
    this.validateOptions(options);
    this.namespace = options.namespace;
    this.version = options.version;
    this.highAvailability = options.highAvailability;
    this.network = options.network;
    this.security = options.security;
  }

  private validateOptions(options: KubernetesConfigOptions): void {
    if (!options.namespace || !options.version) {
      throw new Error('Invalid cluster configuration');
    }

    if (options.network) {
      this.validateNetworkConfig(options.network);
    }
  }

  private validateNetworkConfig(network: { serviceCIDR: string; podCIDR: string }): void {
    const cidrPattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[1-2][0-9]|3[0-2])$/;
    if (!cidrPattern.test(network.serviceCIDR) || !cidrPattern.test(network.podCIDR)) {
      throw new Error('Invalid network configuration');
    }
  }

  public getClusterConfig(): ClusterConfig {
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