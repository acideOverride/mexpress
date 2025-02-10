import { DeploymentConfig, DeploymentConfigOptions, ServicePort, HealthCheck } from '../types/deployment-config';

export class ServiceDeployment {
  private name: string;
  private namespace: string;
  private image: string;
  private version: string;
  private ports: ServicePort[];
  private healthCheck?: HealthCheck;
  private resources?: {
    requests?: {
      cpu?: string;
      memory?: string;
    };
    limits?: {
      cpu?: string;
      memory?: string;
    };
  };
  private labels?: Record<string, string>;

  constructor(options: DeploymentConfigOptions) {
    this.validateConfig(options);
    this.name = options.name;
    this.namespace = options.namespace;
    this.image = options.image;
    this.version = options.version;
    this.ports = options.ports;
    this.healthCheck = options.healthCheck;
    this.resources = options.resources;
    this.labels = options.labels;
  }

  private validateConfig(options: DeploymentConfigOptions): void {
    // Validate required fields
    if (!options.name || !options.namespace || !options.image || !options.version || !options.ports.length) {
      throw new Error('Invalid service configuration');
    }

    // Validate ports
    for (const port of options.ports) {
      if (port.port < 1 || port.targetPort < 1 || !['TCP', 'UDP'].includes(port.protocol)) {
        throw new Error('Invalid service configuration');
      }
    }

    // Validate health check if provided
    if (options.healthCheck) {
      const { path, port, initialDelaySeconds, periodSeconds, timeoutSeconds, successThreshold, failureThreshold } = options.healthCheck;
      if (
        !path ||
        port < 1 ||
        initialDelaySeconds < 0 ||
        periodSeconds < 1 ||
        timeoutSeconds < 1 ||
        successThreshold < 1 ||
        failureThreshold < 1
      ) {
        throw new Error('Invalid service configuration');
      }
    }

    // Validate resource configuration if provided
    if (options.resources) {
      const { requests, limits } = options.resources;

      // Validate CPU format (e.g., '100m', '0.1')
      const cpuRegex = /^\d+m$|^\d*\.?\d+$/;
      if (
        (requests?.cpu && !cpuRegex.test(requests.cpu)) ||
        (limits?.cpu && !cpuRegex.test(limits.cpu))
      ) {
        throw new Error('Invalid service configuration');
      }

      // Validate memory format (e.g., '128Mi', '1Gi')
      const memoryRegex = /^\d+[KMGT]i$/;
      if (
        (requests?.memory && !memoryRegex.test(requests.memory)) ||
        (limits?.memory && !memoryRegex.test(limits.memory))
      ) {
        throw new Error('Invalid service configuration');
      }

      // Validate that limits are not negative
      if (
        (requests?.cpu && requests.cpu.startsWith('-')) ||
        (requests?.memory && requests.memory.startsWith('-')) ||
        (limits?.cpu && limits.cpu.startsWith('-')) ||
        (limits?.memory && limits.memory.startsWith('-'))
      ) {
        throw new Error('Invalid service configuration');
      }
    }
  }

  public getDeploymentConfig(): DeploymentConfig {
    const labels = {
      app: this.name,
      version: this.version,
      ...this.labels
    };

    return {
      apiVersion: 'v1',
      kind: 'Deployment',
      metadata: {
        name: this.name,
        namespace: this.namespace,
        labels
      },
      spec: {
        image: this.image,
        version: this.version,
        ports: this.ports,
        replicas: 1,
        selector: {
          matchLabels: labels
        },
        template: {
          metadata: {
            labels
          },
          spec: {
            containers: [{
              name: this.name,
              image: `${this.image}:${this.version}`,
              ports: this.ports,
              healthCheck: this.healthCheck,
              resources: this.resources
            }]
          }
        },
        healthCheck: this.healthCheck,
        resources: this.resources
      }
    };
  }
}