import { HAConfig, HAConfigOptions, LoadBalancerConfig, FailoverConfig, MonitoringConfig, ReplicaDistribution } from '../types/ha-config';

export class HighAvailability {
  private name: string;
  private namespace: string;
  private labels?: Record<string, string>;
  private loadBalancer: LoadBalancerConfig;
  private failover: FailoverConfig;
  private distribution: ReplicaDistribution;
  private monitoring: MonitoringConfig;

  constructor(options: HAConfigOptions) {
    this.validateConfig(options);
    this.name = options.name;
    this.namespace = options.namespace;
    this.labels = options.labels;

    // Configure load balancer with defaults
    this.loadBalancer = {
      type: options.loadBalancer?.type ?? 'round-robin',
      algorithm: options.loadBalancer?.algorithm ?? 'weighted',
      healthCheck: {
        path: options.loadBalancer?.healthCheck?.path ?? '/health',
        port: options.loadBalancer?.healthCheck?.port ?? 8080,
        interval: options.loadBalancer?.healthCheck?.interval ?? 10,
        timeout: options.loadBalancer?.healthCheck?.timeout ?? 5,
        unhealthyThreshold: options.loadBalancer?.healthCheck?.unhealthyThreshold ?? 3,
        healthyThreshold: options.loadBalancer?.healthCheck?.healthyThreshold ?? 2
      },
      sessionAffinity: {
        enabled: options.loadBalancer?.sessionAffinity?.enabled ?? false,
        timeout: options.loadBalancer?.sessionAffinity?.timeout ?? 3600
      }
    };

    // Configure failover with defaults
    this.failover = {
      enabled: options.failover?.enabled ?? true,
      timeout: options.failover?.timeout ?? 10,
      maxRetries: options.failover?.maxRetries ?? 5,
      backoffMultiplier: options.failover?.backoffMultiplier ?? 2,
      maxBackoffTime: options.failover?.maxBackoffTime ?? 30
    };

    // Configure distribution with defaults
    this.distribution = {
      zones: options.distribution?.zones ?? ['zone-1', 'zone-2', 'zone-3'],
      minPerZone: options.distribution?.minPerZone ?? 1,
      maxPerZone: options.distribution?.maxPerZone ?? 3,
      spreadPolicy: options.distribution?.spreadPolicy ?? 'balanced'
    };

    // Configure monitoring with defaults
    this.monitoring = {
      enabled: options.monitoring?.enabled ?? true,
      metrics: options.monitoring?.metrics ?? ['latency', 'throughput', 'errors'],
      alerting: {
        enabled: options.monitoring?.alerting?.enabled ?? true,
        thresholds: {
          responseTime: options.monitoring?.alerting?.thresholds?.responseTime ?? 1000,
          errorRate: options.monitoring?.alerting?.thresholds?.errorRate ?? 0.01,
          availabilityPercent: options.monitoring?.alerting?.thresholds?.availabilityPercent ?? 99.9
        }
      }
    };
  }

  private validateConfig(options: HAConfigOptions): void {
    // Validate required fields
    if (!options.name || !options.namespace) {
      throw new Error('Invalid HA configuration');
    }

    // Validate load balancer if provided
    if (options.loadBalancer) {
      if (options.loadBalancer.type && !['round-robin', 'least-connections', 'ip-hash'].includes(options.loadBalancer.type)) {
        throw new Error('Invalid HA configuration');
      }

      if (options.loadBalancer.healthCheck) {
        const { port, interval, timeout, unhealthyThreshold, healthyThreshold } = options.loadBalancer.healthCheck;
        if (
          (port !== undefined && port < 1) ||
          (interval !== undefined && interval < 1) ||
          (timeout !== undefined && timeout < 1) ||
          (unhealthyThreshold !== undefined && unhealthyThreshold < 1) ||
          (healthyThreshold !== undefined && healthyThreshold < 1)
        ) {
          throw new Error('Invalid HA configuration');
        }
      }
    }

    // Validate failover if provided
    if (options.failover) {
      const { timeout, maxRetries, backoffMultiplier, maxBackoffTime } = options.failover;
      if (
        (timeout !== undefined && timeout < 1) ||
        (maxRetries !== undefined && maxRetries < 1) ||
        (backoffMultiplier !== undefined && backoffMultiplier < 1) ||
        (maxBackoffTime !== undefined && maxBackoffTime < 1)
      ) {
        throw new Error('Invalid HA configuration');
      }
    }

    // Validate distribution if provided
    if (options.distribution) {
      const { minPerZone, maxPerZone } = options.distribution;
      const minZones = minPerZone ?? 1;  // Use default if not provided
      const maxZones = maxPerZone ?? 3;  // Use default if not provided
      
      if (minZones < 1 || (maxZones !== undefined && maxZones < minZones)) {
        throw new Error('Invalid HA configuration');
      }
    }

    // Validate monitoring if provided
    if (options.monitoring?.alerting?.thresholds) {
      const { responseTime, errorRate, availabilityPercent } = options.monitoring.alerting.thresholds;
      if (
        (responseTime !== undefined && responseTime < 0) ||
        (errorRate !== undefined && (errorRate < 0 || errorRate > 1)) ||
        (availabilityPercent !== undefined && (availabilityPercent < 0 || availabilityPercent > 100))
      ) {
        throw new Error('Invalid HA configuration');
      }
    }
  }

  public getHAConfig(): HAConfig {
    return {
      apiVersion: 'v1',
      kind: 'HighAvailabilityConfiguration',
      metadata: {
        name: this.name,
        namespace: this.namespace,
        labels: this.labels
      },
      spec: {
        loadBalancer: this.loadBalancer,
        failover: this.failover,
        distribution: this.distribution,
        monitoring: this.monitoring
      }
    };
  }
}