import { DeploymentConfig, DeploymentConfigOptions, ServicePort, HealthCheck } from '../types/deployment-config';

export class ServiceDeployment {
  private name: string;
  private namespace: string;
  private image: string;
  private version: string;
  private ports: ServicePort[];
  private healthCheck?: Partial<HealthCheck>;
  private resources?: {
    cpu?: { request?: string; limit?: string };
    memory?: { request?: string; limit?: string };
  };

  constructor(options: DeploymentConfigOptions) {
    this.validateOptions(options);
    this.name = options.name;
    this.namespace = options.namespace;
    this.image = options.image;
    this.version = options.version;
    this.ports = options.ports;
    this.healthCheck = options.healthCheck;
    this.resources = options.resources;
  }

  private validateOptions(options: DeploymentConfigOptions): void {
    if (!options.name || !options.namespace || !options.image || !options.version) {
      throw new Error('Invalid deployment configuration');
    }

    this.validatePorts(options.ports);
  }

  private validatePorts(ports: ServicePort[]): void {
    if (!ports.length) {
      throw new Error('Invalid deployment configuration');
    }

    for (const port of ports) {
      if (port.port < 1 || port.targetPort < 1) {
        throw new Error('Invalid port configuration');
      }
    }
  }

  private getDefaultHealthCheck(): HealthCheck {
    return {
      path: '/',
      port: this.ports[0].port,
      initialDelaySeconds: 30,
      periodSeconds: 10,
      timeoutSeconds: 5,
      successThreshold: 1,
      failureThreshold: 3
    };
  }

  private getDefaultResources() {
    return {
      cpu: {
        request: '50m',
        limit: '100m'
      },
      memory: {
        request: '64Mi',
        limit: '128Mi'
      }
    };
  }

  private mergeHealthCheck(userConfig?: Partial<HealthCheck>): HealthCheck {
    const defaultConfig = this.getDefaultHealthCheck();
    if (!userConfig) {
      return defaultConfig;
    }

    return {
      ...defaultConfig,
      ...userConfig
    };
  }

  private mergeResources(userResources?: { cpu?: any; memory?: any }) {
    const defaultResources = this.getDefaultResources();
    if (!userResources) {
      return defaultResources;
    }

    return {
      cpu: {
        ...defaultResources.cpu,
        ...userResources.cpu
      },
      memory: {
        ...defaultResources.memory,
        ...userResources.memory
      }
    };
  }

  public getDeploymentConfig(): DeploymentConfig {
    return {
      apiVersion: 'v1',
      kind: 'Deployment',
      metadata: {
        name: this.name,
        namespace: this.namespace
      },
      spec: {
        name: this.name,
        image: this.image,
        version: this.version,
        ports: this.ports,
        healthCheck: this.mergeHealthCheck(this.healthCheck),
        resources: this.mergeResources(this.resources),
        replicas: {
          min: 1,
          max: 5,
          target: 1
        },
        environment: {}
      }
    };
  }
}