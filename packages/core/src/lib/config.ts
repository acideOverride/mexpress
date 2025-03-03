/**
 * Configuration for various services
 * MEXP-2025-007-BE Integration Architecture
 */

/**
 * Service Mesh Configuration 
 */
export interface ServiceMeshConfig {
  /**
   * Service mesh type (e.g., istio, linkerd)
   */
  type: 'istio' | 'linkerd' | 'consul';
  
  /**
   * API endpoint for service mesh control plane
   */
  endpoint: string;
  
  /**
   * Namespace for service mesh resources
   */
  namespace: string;
  
  /**
   * Authentication credentials
   */
  auth?: {
    token?: string;
    username?: string;
    password?: string;
    certificatePath?: string;
    keyPath?: string;
  };
  
  /**
   * Automatic sidecar injection
   */
  autoInject: boolean;
  
  /**
   * Enable or disable traffic management features
   */
  trafficManagement: {
    enabled: boolean;
    defaultRetry?: {
      attempts: number;
      timeout: string;
      conditions: string[];
    };
    defaultTimeout?: string;
    defaultCircuitBreaker?: {
      consecutiveErrors: number;
      interval: string;
      baseEjectionTime: string;
      maxEjectionPercent: number;
    };
  };
  
  /**
   * Enable or disable security features
   */
  security: {
    enabled: boolean;
    mtls: 'strict' | 'permissive' | 'disabled';
    authorization: boolean;
  };
  
  /**
   * Enable or disable observability features
   */
  observability: {
    tracing: boolean;
    metrics: boolean;
    logging: boolean;
  };
}

/**
 * Deployment Configuration
 */
export interface DeploymentConfig {
  /**
   * Environment name (e.g., dev, staging, production)
   */
  environment: string;
  
  /**
   * Region or location
   */
  region: string;
  
  /**
   * Container orchestration platform
   */
  platform: 'kubernetes' | 'docker-compose' | 'aws-ecs';
  
  /**
   * Configuration repository
   */
  configRepo: {
    type: 'git' | 's3' | 'consul';
    url: string;
    branch?: string;
    path?: string;
  };
  
  /**
   * Deployment strategy
   */
  strategy: {
    type: 'rolling' | 'blue-green' | 'canary';
    options?: Record<string, any>;
  };
  
  /**
   * Infrastructure configuration
   */
  infrastructure: {
    networking: {
      ingressEnabled: boolean;
      loadBalancerType?: string;
    };
    storage: {
      persistentVolumes: boolean;
      storageClass?: string;
    };
    resources: {
      limitsCpu: string;
      limitsMemory: string;
      requestsCpu: string;
      requestsMemory: string;
    };
  };
  
  /**
   * Scaling configuration
   */
  scaling: {
    minReplicas: number;
    maxReplicas: number;
    targetCpuUtilization: number;
    targetMemoryUtilization: number;
  };
  
  /**
   * Health check configuration
   */
  healthChecks: {
    livenessProbe: {
      path: string;
      port: number;
      initialDelay: number;
      period: number;
    };
    readinessProbe: {
      path: string;
      port: number;
      initialDelay: number;
      period: number;
    };
  };
}

/**
 * Database Configuration
 */
export interface DatabaseConfig {
  /**
   * Database type
   */
  type: 'mongodb' | 'postgresql' | 'mysql' | 'redis';
  
  /**
   * Host or connection string
   */
  host: string;
  
  /**
   * Database port
   */
  port: number;
  
  /**
   * Database name
   */
  name: string;
  
  /**
   * Authentication credentials
   */
  auth: {
    username: string;
    password: string;
    authSource?: string;
  };
  
  /**
   * Connection pool configuration
   */
  pool?: {
    min: number;
    max: number;
    idleTimeoutMs: number;
  };
  
  /**
   * SSL/TLS configuration
   */
  ssl?: {
    enabled: boolean;
    rejectUnauthorized?: boolean;
    ca?: string;
    cert?: string;
    key?: string;
  };
  
  /**
   * Additional database-specific options
   */
  options?: Record<string, any>;
}

/**
 * Message Queue Configuration
 */
export interface MessageQueueConfig {
  /**
   * Message queue type
   */
  type: 'rabbitmq' | 'kafka' | 'sqs' | 'redis';
  
  /**
   * Connection details
   */
  connection: {
    host: string;
    port: number;
    vhost?: string;
  };
  
  /**
   * Authentication credentials
   */
  auth: {
    username?: string;
    password?: string;
  };
  
  /**
   * Exchange or topic configuration
   */
  exchange?: {
    name: string;
    type: 'direct' | 'fanout' | 'topic';
    durable: boolean;
  };
  
  /**
   * Consumer configuration
   */
  consumer?: {
    prefetch: number;
    retryAttempts: number;
    retryDelay: number;
  };
  
  /**
   * Producer configuration
   */
  producer?: {
    confirmPublish: boolean;
    persistent: boolean;
  };
  
  /**
   * SSL/TLS configuration
   */
  ssl?: {
    enabled: boolean;
    cert?: string;
    key?: string;
    ca?: string;
  };
}

/**
 * Logging Configuration
 */
export interface LoggingConfig {
  /**
   * Log level
   */
  level: 'debug' | 'info' | 'warn' | 'error';
  
  /**
   * Output targets
   */
  targets: Array<{
    type: 'console' | 'file' | 'http' | 'elasticsearch';
    options?: Record<string, any>;
  }>;
  
  /**
   * Format options
   */
  format: {
    type: 'json' | 'text';
    prettyPrint?: boolean;
    colorize?: boolean;
  };
  
  /**
   * Context information to include in logs
   */
  context?: {
    includeTimestamp: boolean;
    includeHostname: boolean;
    includeProcessId: boolean;
    includePid: boolean;
    includeTraceId: boolean;
  };
  
  /**
   * Redaction settings for sensitive information
   */
  redaction?: {
    enabled: boolean;
    fields: string[];
    replacement: string;
  };
}