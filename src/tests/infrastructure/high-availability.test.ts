import { HighAvailability } from '../../lib/high-availability';
import { HAConfigOptions } from '../../types/ha-config';

describe('HighAvailability', () => {
  describe('Configuration Setup', () => {
    let ha: HighAvailability;
    
    beforeEach(() => {
      ha = new HighAvailability({
        name: 'test-service',
        namespace: 'default',
        loadBalancer: {
          type: 'round-robin',
          algorithm: 'weighted'
        },
        distribution: {
          zones: ['zone-1', 'zone-2', 'zone-3'],
          minPerZone: 1,
          maxPerZone: 3
        }
      });
    });

    test('should create valid HA configuration', () => {
      const config = ha.getHAConfig();
      expect(config.apiVersion).toBe('v1');
      expect(config.kind).toBe('HighAvailabilityConfiguration');
      expect(config.metadata.name).toBe('test-service');
      expect(config.metadata.namespace).toBe('default');
      expect(config.spec.loadBalancer.type).toBe('round-robin');
      expect(config.spec.distribution.zones).toHaveLength(3);
    });

    test('should throw error for invalid configuration', () => {
      expect(() => new HighAvailability({
        name: '',
        namespace: '',
        loadBalancer: {
          type: 'invalid-type' as any
        }
      })).toThrow('Invalid HA configuration');
    });
  });

  describe('Load Balancer Configuration', () => {
    let ha: HighAvailability;
    
    beforeEach(() => {
      ha = new HighAvailability({
        name: 'test-service',
        namespace: 'default',
        loadBalancer: {
          type: 'least-connections',
          algorithm: 'weighted',
          healthCheck: {
            path: '/health',
            port: 8080,
            interval: 10,
            timeout: 5,
            unhealthyThreshold: 3,
            healthyThreshold: 2
          },
          sessionAffinity: {
            enabled: true,
            timeout: 3600
          }
        }
      });
    });

    test('should configure load balancer with health checks', () => {
      const config = ha.getHAConfig();
      const healthCheck = config.spec.loadBalancer.healthCheck;
      expect(healthCheck.path).toBe('/health');
      expect(healthCheck.port).toBe(8080);
      expect(healthCheck.interval).toBe(10);
      expect(healthCheck.timeout).toBe(5);
    });

    test('should configure session affinity', () => {
      const config = ha.getHAConfig();
      const affinity = config.spec.loadBalancer.sessionAffinity;
      if (!affinity) {
        fail('Session affinity should be defined');
      }
      expect(affinity.enabled).toBe(true);
      expect(affinity.timeout).toBe(3600);
    });
  });

  describe('Failover Configuration', () => {
    let ha: HighAvailability;
    
    beforeEach(() => {
      ha = new HighAvailability({
        name: 'test-service',
        namespace: 'default',
        failover: {
          enabled: true,
          timeout: 5,
          maxRetries: 3,
          backoffMultiplier: 2,
          maxBackoffTime: 30
        }
      });
    });

    test('should configure failover settings', () => {
      const config = ha.getHAConfig();
      expect(config.spec.failover.enabled).toBe(true);
      expect(config.spec.failover.timeout).toBe(5);
      expect(config.spec.failover.maxRetries).toBe(3);
      expect(config.spec.failover.backoffMultiplier).toBe(2);
      expect(config.spec.failover.maxBackoffTime).toBe(30);
    });

    test('should use default failover settings if not provided', () => {
      const basicHA = new HighAvailability({
        name: 'basic-service',
        namespace: 'default'
      });
      const config = basicHA.getHAConfig();
      expect(config.spec.failover.enabled).toBe(true);
      expect(config.spec.failover.timeout).toBe(10);
      expect(config.spec.failover.maxRetries).toBe(5);
    });
  });

  describe('Monitoring Configuration', () => {
    let ha: HighAvailability;
    
    beforeEach(() => {
      ha = new HighAvailability({
        name: 'test-service',
        namespace: 'default',
        monitoring: {
          enabled: true,
          metrics: ['latency', 'throughput', 'errors'],
          alerting: {
            enabled: true,
            thresholds: {
              responseTime: 500,
              errorRate: 0.01,
              availabilityPercent: 99.9
            }
          }
        }
      });
    });

    test('should configure monitoring and alerting', () => {
      const config = ha.getHAConfig();
      expect(config.spec.monitoring.enabled).toBe(true);
      expect(config.spec.monitoring.metrics).toContain('latency');
      expect(config.spec.monitoring.alerting.enabled).toBe(true);
      expect(config.spec.monitoring.alerting.thresholds.responseTime).toBe(500);
      expect(config.spec.monitoring.alerting.thresholds.availabilityPercent).toBe(99.9);
    });

    test('should use default monitoring settings if not provided', () => {
      const basicHA = new HighAvailability({
        name: 'basic-service',
        namespace: 'default'
      });
      const config = basicHA.getHAConfig();
      expect(config.spec.monitoring.enabled).toBe(true);
      expect(config.spec.monitoring.metrics).toContain('errors');
      expect(config.spec.monitoring.alerting.enabled).toBe(true);
    });
  });
});