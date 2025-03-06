/**
 * Mock Service Deployment Implementation
 */

class ServiceDeployment {
  static ERROR_MESSAGES = {
    INVALID_CONFIG: 'Invalid deployment configuration',
    INVALID_PORTS: 'Invalid deployment configuration: invalid ports',
    INVALID_HEALTH_CHECK: 'Invalid deployment configuration: invalid health check',
    INVALID_RESOURCES: 'Invalid deployment configuration: invalid resources'
  };

  constructor(options) {
    this.validateConfig(options);
    this.name = options.name;
    this.namespace = options.namespace;
    this.image = options.image;
    this.version = options.version;
    this.ports = options.ports;
    this.healthCheck = options.healthCheck;
    this.resources = options.resources;
    this.labels = options.labels;
    
    // For compatibility with the original implementation
    this.initialized = false;
    this.config = options;
  }

  validateConfig(options) {
    // Validate required fields
    if (!options.name || !options.namespace || !options.image || !options.version || !options.ports.length) {
      throw new Error(ServiceDeployment.ERROR_MESSAGES.INVALID_CONFIG);
    }

    // Validate ports
    for (const port of options.ports) {
      if (port.port < 1 || port.targetPort < 1 || !['TCP', 'UDP'].includes(port.protocol)) {
        throw new Error(ServiceDeployment.ERROR_MESSAGES.INVALID_PORTS);
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
        throw new Error(ServiceDeployment.ERROR_MESSAGES.INVALID_HEALTH_CHECK);
      }
    }

    // Validate resource configuration if provided
    if (options.resources) {
      const { requests, limits } = options.resources;

      // Validate that limits are not negative
      if (
        (requests?.cpu && requests.cpu.startsWith('-')) ||
        (requests?.memory && requests.memory.startsWith('-')) ||
        (limits?.cpu && limits.cpu.startsWith('-')) ||
        (limits?.memory && limits.memory.startsWith('-'))
      ) {
        throw new Error(ServiceDeployment.ERROR_MESSAGES.INVALID_RESOURCES);
      }
    }
  }

  getDeploymentConfig() {
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
  
  // Compatibility methods with original implementation
  async initialize() {
    this.initialized = true;
    return undefined;
  }

  async getStatus(serviceName) {
    return {
      phase: 'Running',
      availableReplicas: 3,
      conditions: [{ type: 'Available', status: 'True' }]
    };
  }

  async validateHealth() {
    return { healthy: true, errorRate: 0 };
  }
}

module.exports = {
  ServiceDeployment
};