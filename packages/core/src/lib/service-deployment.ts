/**
 * Service Deployment Manager
 * MEXP-2025-007-BE Integration Architecture
 */
import { DeploymentConfig, DeploymentConfigOptions, ServicePort } from '../types/deployment-config';

export interface ServiceDeploymentOptions {
  name: string;
  version: string;
  replicas: number;
  image: string;
  ports: ServicePort[];
  env?: Record<string, string>;
  volumeMounts?: Array<{
    name: string;
    mountPath: string;
    readOnly?: boolean;
  }>;
  volumes?: Array<{
    name: string;
    type: 'configMap' | 'secret' | 'emptyDir' | 'persistentVolumeClaim';
    source?: string;
  }>;
  resources?: {
    limits?: {
      cpu?: string;
      memory?: string;
    };
    requests?: {
      cpu?: string;
      memory?: string;
    };
  };
  healthChecks?: {
    liveness?: {
      path: string;
      port: number;
      initialDelaySeconds: number;
      periodSeconds: number;
      timeoutSeconds: number;
      successThreshold: number;
      failureThreshold: number;
    };
    readiness?: {
      path: string;
      port: number;
      initialDelaySeconds: number;
      periodSeconds: number;
      timeoutSeconds: number;
      successThreshold: number;
      failureThreshold: number;
    };
  };
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
}

export interface ServiceDeploymentStatus {
  name: string;
  version: string;
  replicas: number;
  availableReplicas: number;
  readyReplicas: number;
  updatedReplicas: number;
  unavailableReplicas: number;
  conditions: Array<{
    type: string;
    status: string;
    reason: string;
    message: string;
    lastUpdateTime: string;
  }>;
  pods: Array<{
    name: string;
    phase: 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Unknown';
    startTime: string;
    restartCount: number;
    containersReady: boolean;
  }>;
}

export interface DeploymentHistory {
  version: string;
  deployedAt: string;
  deployedBy: string;
  status: 'success' | 'failed' | 'cancelled' | 'running';
  environment: string;
  commitSha?: string;
}

/**
 * Manages service deployments
 */
export class ServiceDeployment {
  private config: DeploymentConfig;
  private deploymentHistory: Map<string, DeploymentHistory[]>;
  private activeDeployments: Map<string, ServiceDeploymentStatus>;
  
  /**
   * Create a new service deployment manager
   * @param config Deployment configuration
   */
  constructor(config: DeploymentConfig) {
    this.config = config;
    this.deploymentHistory = new Map();
    this.activeDeployments = new Map();
  }
  
  /**
   * Deploy a service
   * @param options Service deployment options
   */
  async deploy(options: ServiceDeploymentOptions): Promise<ServiceDeploymentStatus> {
    console.log(`Deploying service ${options.name}:${options.version} to ${this.config.environment}`);
    
    // Calculate a stable ID for this deployment
    const deploymentId = `${options.name}-${options.version}-${Date.now()}`;
    
    // Create a deployment status object
    const status: ServiceDeploymentStatus = {
      name: options.name,
      version: options.version,
      replicas: options.replicas,
      availableReplicas: 0,
      readyReplicas: 0,
      updatedReplicas: 0,
      unavailableReplicas: options.replicas,
      conditions: [
        {
          type: 'Progressing',
          status: 'True',
          reason: 'NewReplicaSetCreated',
          message: 'Deployment is progressing with status update',
          lastUpdateTime: new Date().toISOString()
        }
      ],
      pods: []
    };
    
    // Record deployment history
    const history: DeploymentHistory = {
      version: options.version,
      deployedAt: new Date().toISOString(),
      deployedBy: 'system',
      status: 'running',
      environment: this.config.environment
    };
    
    // Add to deployment history
    const serviceHistory = this.deploymentHistory.get(options.name) || [];
    serviceHistory.unshift(history);
    this.deploymentHistory.set(options.name, serviceHistory);
    
    // Store the active deployment
    this.activeDeployments.set(options.name, status);
    
    // Simulate deployment rollout over time
    setTimeout(() => {
      this.updateDeploymentStatus(options.name, {
        availableReplicas: Math.floor(options.replicas / 2),
        readyReplicas: Math.floor(options.replicas / 3),
        updatedReplicas: options.replicas,
        unavailableReplicas: options.replicas - Math.floor(options.replicas / 2),
        conditions: [
          {
            type: 'Progressing',
            status: 'True',
            reason: 'ReplicaSetUpdated',
            message: 'Deployment is progressing',
            lastUpdateTime: new Date().toISOString()
          }
        ]
      });
      
      // Complete deployment after a delay
      setTimeout(() => {
        this.updateDeploymentStatus(options.name, {
          availableReplicas: options.replicas,
          readyReplicas: options.replicas,
          updatedReplicas: options.replicas,
          unavailableReplicas: 0,
          conditions: [
            {
              type: 'Available',
              status: 'True',
              reason: 'MinimumReplicasAvailable',
              message: 'Deployment has minimum availability',
              lastUpdateTime: new Date().toISOString()
            },
            {
              type: 'Progressing',
              status: 'True',
              reason: 'NewReplicaSetAvailable',
              message: 'Deployment successfully progressed',
              lastUpdateTime: new Date().toISOString()
            }
          ]
        });
        
        // Update history status
        const history = this.deploymentHistory.get(options.name) || [];
        if (history.length > 0) {
          history[0].status = 'success';
          this.deploymentHistory.set(options.name, history);
        }
      }, 5000);
    }, 2000);
    
    return status;
  }
  
  /**
   * Get deployment status
   * @param serviceName Service name
   */
  async getDeploymentStatus(serviceName: string): Promise<ServiceDeploymentStatus | null> {
    return this.activeDeployments.get(serviceName) || null;
  }
  
  /**
   * Get deployment history
   * @param serviceName Service name
   * @param limit Maximum number of history entries to return
   */
  async getDeploymentHistory(serviceName: string, limit = 10): Promise<DeploymentHistory[]> {
    const history = this.deploymentHistory.get(serviceName) || [];
    return history.slice(0, limit);
  }
  
  /**
   * Rollback a deployment to a previous version
   * @param serviceName Service name
   * @param targetVersion Target version to rollback to (if undefined, rolls back to previous version)
   */
  async rollback(serviceName: string, targetVersion?: string): Promise<ServiceDeploymentStatus | null> {
    console.log(`Rolling back service ${serviceName}${targetVersion ? ' to version ' + targetVersion : ''}`);
    
    const history = this.deploymentHistory.get(serviceName) || [];
    if (history.length < 2) {
      console.error(`No deployment history available for ${serviceName}`);
      return null;
    }
    
    let targetHistoryEntry: DeploymentHistory | undefined;
    
    if (targetVersion) {
      // Find the specific version to roll back to
      targetHistoryEntry = history.find(entry => entry.version === targetVersion);
      if (!targetHistoryEntry) {
        console.error(`Version ${targetVersion} not found in deployment history`);
        return null;
      }
    } else {
      // Just use the previous successful deployment
      targetHistoryEntry = history.find((entry, index) => 
        index > 0 && entry.status === 'success'
      );
      
      if (!targetHistoryEntry) {
        console.error('No previous successful deployment found');
        return null;
      }
    }
    
    // Get the current deployment
    const currentDeployment = this.activeDeployments.get(serviceName);
    if (!currentDeployment) {
      console.error(`No active deployment found for ${serviceName}`);
      return null;
    }
    
    // Create options for redeployment
    const options: ServiceDeploymentOptions = {
      name: serviceName,
      version: targetHistoryEntry.version,
      replicas: currentDeployment.replicas,
      image: `${serviceName}:${targetHistoryEntry.version}`,
      ports: [{ containerPort: 8080, servicePort: 80 }] // Simplified for example
    };
    
    // Record rollback in history
    const rollbackHistory: DeploymentHistory = {
      version: targetHistoryEntry.version,
      deployedAt: new Date().toISOString(),
      deployedBy: 'system',
      status: 'running',
      environment: this.config.environment
    };
    
    history.unshift(rollbackHistory);
    this.deploymentHistory.set(serviceName, history);
    
    // Return deployment status
    return this.deploy(options);
  }
  
  /**
   * Scale a deployment
   * @param serviceName Service name
   * @param replicas Number of replicas
   */
  async scale(serviceName: string, replicas: number): Promise<ServiceDeploymentStatus | null> {
    console.log(`Scaling service ${serviceName} to ${replicas} replicas`);
    
    const deployment = this.activeDeployments.get(serviceName);
    if (!deployment) {
      console.error(`No active deployment found for ${serviceName}`);
      return null;
    }
    
    // Update deployment
    const updatedDeployment = { ...deployment, replicas };
    
    // Simulate scaling
    if (replicas > deployment.replicas) {
      // Scaling up
      updatedDeployment.unavailableReplicas += (replicas - deployment.replicas);
    } else {
      // Scaling down
      updatedDeployment.availableReplicas = Math.min(updatedDeployment.availableReplicas, replicas);
      updatedDeployment.readyReplicas = Math.min(updatedDeployment.readyReplicas, replicas);
      updatedDeployment.unavailableReplicas = Math.max(0, replicas - updatedDeployment.availableReplicas);
    }
    
    this.activeDeployments.set(serviceName, updatedDeployment);
    
    // Simulate completion of scaling
    setTimeout(() => {
      this.updateDeploymentStatus(serviceName, {
        availableReplicas: replicas,
        readyReplicas: replicas,
        updatedReplicas: replicas,
        unavailableReplicas: 0
      });
    }, 3000);
    
    return updatedDeployment;
  }
  
  /**
   * Delete a deployment
   * @param serviceName Service name
   */
  async delete(serviceName: string): Promise<boolean> {
    console.log(`Deleting service ${serviceName}`);
    
    if (!this.activeDeployments.has(serviceName)) {
      console.error(`No active deployment found for ${serviceName}`);
      return false;
    }
    
    // Record deletion in history
    const history = this.deploymentHistory.get(serviceName) || [];
    const currentDeployment = this.activeDeployments.get(serviceName);
    
    if (currentDeployment && history.length > 0) {
      history[0].status = 'cancelled';
      this.deploymentHistory.set(serviceName, history);
    }
    
    // Remove active deployment
    this.activeDeployments.delete(serviceName);
    
    return true;
  }
  
  /**
   * Create deployment configuration from options
   * @param options Deployment configuration options
   */
  static createConfig(options: DeploymentConfigOptions): DeploymentConfig {
    return {
      apiVersion: 'v1',
      kind: 'Deployment',
      metadata: {
        namespace: options.namespace
      },
      spec: {
        version: options.version,
        highAvailability: options.highAvailability,
        replicas: options.highAvailability ? 3 : 1,
        controlPlane: {
          replicas: options.highAvailability ? 3 : 1
        },
        etcd: {
          replicas: options.highAvailability ? 3 : 1
        },
        resources: {
          requests: {
            cpu: '500m',
            memory: '512Mi'
          },
          limits: {
            cpu: '1000m',
            memory: '1Gi'
          }
        },
        networking: {
          serviceCIDR: options.network?.serviceCIDR || '10.96.0.0/12',
          podCIDR: options.network?.podCIDR || '10.244.0.0/16',
          provider: 'calico'
        },
        security: {
          rbacEnabled: options.security?.rbacEnabled ?? true,
          networkPoliciesEnabled: options.security?.networkPoliciesEnabled ?? true,
          podSecurityPolicies: ['restricted'],
          networkPolicies: ['default-deny-all', 'allow-same-namespace'],
          admissionControllers: ['PodSecurityPolicy', 'LimitRanger'],
          auditLogging: true
        }
      }
    };
  }
  
  /**
   * Generate deployment manifest
   * @param serviceName Service name
   * @param format Output format (yaml or json)
   */
  generateManifest(serviceName: string, format: 'yaml' | 'json' = 'yaml'): string {
    const deployment = this.activeDeployments.get(serviceName);
    if (!deployment) {
      return '';
    }
    
    const manifest = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: deployment.name,
        namespace: this.config.metadata.namespace || 'default',
        labels: {
          app: deployment.name,
          version: deployment.version
        }
      },
      spec: {
        replicas: deployment.replicas,
        selector: {
          matchLabels: {
            app: deployment.name
          }
        },
        template: {
          metadata: {
            labels: {
              app: deployment.name,
              version: deployment.version
            }
          },
          spec: {
            containers: [
              {
                name: deployment.name,
                image: `${deployment.name}:${deployment.version}`,
                resources: {
                  limits: {
                    cpu: '500m',
                    memory: '512Mi'
                  },
                  requests: {
                    cpu: '100m',
                    memory: '128Mi'
                  }
                },
                ports: [
                  {
                    containerPort: 8080
                  }
                ]
              }
            ]
          }
        }
      }
    };
    
    if (format === 'json') {
      return JSON.stringify(manifest, null, 2);
    }
    
    // Simple YAML generation
    return this.objectToYaml(manifest);
  }
  
  /**
   * Update deployment status
   * @param serviceName Service name
   * @param updates Status updates
   */
  private updateDeploymentStatus(serviceName: string, updates: Partial<ServiceDeploymentStatus>): void {
    const deployment = this.activeDeployments.get(serviceName);
    if (!deployment) {
      return;
    }
    
    // Update deployment status
    const updatedDeployment = { ...deployment, ...updates };
    this.activeDeployments.set(serviceName, updatedDeployment);
    
    console.log(`Updated deployment status for ${serviceName}: ${updatedDeployment.availableReplicas}/${updatedDeployment.replicas} replicas available`);
  }
  
  /**
   * Convert an object to YAML string
   * @param obj Object to convert
   */
  private objectToYaml(obj: any, indent = 0): string {
    let result = '';
    const prefix = ' '.repeat(indent);
    
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        result += `${prefix}${key}:\n`;
        for (const item of value) {
          if (typeof item === 'object') {
            result += `${prefix}- \n${this.objectToYaml(item, indent + 2)}`;
          } else {
            result += `${prefix}- ${item}\n`;
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        result += `${prefix}${key}:\n${this.objectToYaml(value, indent + 2)}`;
      } else {
        result += `${prefix}${key}: ${value}\n`;
      }
    }
    
    return result;
  }
}