import { HAConfig, HAConfigOptions, LoadBalancerConfig, LoadBalancerHealthCheck, MonitoringConfig, FailoverConfig, ReplicaDistribution } from '../types/ha-config';

export class HighAvailability {
  private name: string;
  private namespace: string;
  private loadBalancer?: HAConfigOptions['loadBalancer'];
  private failover?: HAConfigOptions['failover'];
  private distribution?: HAConfigOptions['distribution'];
  private monitoring?: HAConfigOptions['monitoring'];

  constructor(options: HAConfigOptions) {
    this.validateOptions(options);
    this.name = options.name;
    this.namespace = options.namespace;
    this.loadBalancer = options.loadBalancer;
    this.failover = options.failover;
    this.distribution = options.distribution;
    this.monitoring = options.monitoring;
  }

  private validateOptions(options: HAConfigOptions): void {
    if (!options.name || !options.namespace) {
      throw new Error('Invalid HA configuration');
    }

    if (options.loadBalancer?.type && 
        !['round-robin', 'least-connections', 'ip-hash'].includes(options.loadBalancer.type)) {
      throw new Error('Invalid HA configuration');
    }
  }

  private getDefaultLoadBalancer(): LoadBalancerConfig {
    return {
      type: 'round-robin',
      algorithm: 'standard',
      healthCheck: {
        path: '/health',
        port: 8080,
        interval: 10,
        timeout: 5,
        unhealthyThreshold: 3,
        healthyThreshold: 2
      },
      sessionAffinity: {
        enabled: false,
        timeout: 3600
      }
    };
  }

  private getDefaultFailover(): FailoverConfig {
    return {
      enabled: true,
      timeout: 10,
      maxRetries: 5,
      backoffMultiplier: 2,
      maxBackoffTime: 60
    };
  }

  private getDefaultMonitoring(): MonitoringConfig {
    return {
      enabled: true,
      metrics: ['errors', 'latency', 'throughput'],
      alerting: {
        enabled: true,
        thresholds: {
          responseTime: 1000,
          errorRate: 0.05,
          availabilityPercent: 99.5
        }
      }
    };
  }

  private mergeLoadBalancer(userConfig?: HAConfigOptions['loadBalancer']): LoadBalancerConfig {
    const defaultConfig = this.getDefaultLoadBalancer();
    if (!userConfig) {
      return defaultConfig;
    }

    const healthCheck: LoadBalancerHealthCheck = {
      path: userConfig.healthCheck?.path ?? defaultConfig.healthCheck.path,
      port: userConfig.healthCheck?.port ?? defaultConfig.healthCheck.port,
      interval: userConfig.healthCheck?.interval ?? defaultConfig.healthCheck.interval,
      timeout: userConfig.healthCheck?.timeout ?? defaultConfig.healthCheck.timeout,
      unhealthyThreshold: userConfig.healthCheck?.unhealthyThreshold ?? defaultConfig.healthCheck.unhealthyThreshold,
      healthyThreshold: userConfig.healthCheck?.healthyThreshold ?? defaultConfig.healthCheck.healthyThreshold
    };

    return {
      type: userConfig.type ?? defaultConfig.type,
      algorithm: userConfig.algorithm ?? defaultConfig.algorithm,
      healthCheck,
      sessionAffinity: {
        enabled: userConfig.sessionAffinity?.enabled ?? defaultConfig.sessionAffinity.enabled,
        timeout: userConfig.sessionAffinity?.timeout ?? defaultConfig.sessionAffinity.timeout
      }
    };
  }

  private mergeFailover(userFailover?: HAConfigOptions['failover']): FailoverConfig {
    const defaultFailover = this.getDefaultFailover();
    if (!userFailover) {
      return defaultFailover;
    }

    return {
      enabled: userFailover.enabled ?? defaultFailover.enabled,
      timeout: userFailover.timeout ?? defaultFailover.timeout,
      maxRetries: userFailover.maxRetries ?? defaultFailover.maxRetries,
      backoffMultiplier: userFailover.backoffMultiplier ?? defaultFailover.backoffMultiplier,
      maxBackoffTime: userFailover.maxBackoffTime ?? defaultFailover.maxBackoffTime
    };
  }

  private mergeMonitoring(userMonitoring?: HAConfigOptions['monitoring']): MonitoringConfig {
    const defaultMonitoring = this.getDefaultMonitoring();
    if (!userMonitoring) {
      return defaultMonitoring;
    }

    return {
      enabled: userMonitoring.enabled ?? defaultMonitoring.enabled,
      metrics: userMonitoring.metrics ?? defaultMonitoring.metrics,
      alerting: {
        enabled: userMonitoring.alerting?.enabled ?? defaultMonitoring.alerting.enabled,
        thresholds: {
          responseTime: userMonitoring.alerting?.thresholds?.responseTime ?? defaultMonitoring.alerting.thresholds.responseTime,
          errorRate: userMonitoring.alerting?.thresholds?.errorRate ?? defaultMonitoring.alerting.thresholds.errorRate,
          availabilityPercent: userMonitoring.alerting?.thresholds?.availabilityPercent ?? defaultMonitoring.alerting.thresholds.availabilityPercent
        }
      }
    };
  }

  public getHAConfig(): HAConfig {
    return {
      apiVersion: 'v1',
      kind: 'HighAvailabilityConfiguration',
      metadata: {
        name: this.name,
        namespace: this.namespace
      },
      spec: {
        loadBalancer: this.mergeLoadBalancer(this.loadBalancer),
        failover: this.mergeFailover(this.failover),
        distribution: {
          zones: this.distribution?.zones ?? ['default-zone'],
          minPerZone: this.distribution?.minPerZone ?? 1,
          maxPerZone: this.distribution?.maxPerZone ?? 5,
          spreadPolicy: this.distribution?.spreadPolicy ?? 'balanced'
        },
        monitoring: this.mergeMonitoring(this.monitoring)
      }
    };
  }
}