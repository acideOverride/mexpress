import fs from 'fs';
import path from 'path';

describe('Performance Monitoring Setup', () => {
  const monitoringConfigPath = path.join(process.cwd(), 'config/monitoring.json');
  
  let monitoringConfig: any;

  beforeAll(() => {
    const configContent = fs.readFileSync(monitoringConfigPath, 'utf8');
    monitoringConfig = JSON.parse(configContent);
  });

  describe('Metrics Collection', () => {
    it('should have required metrics configuration', () => {
      expect(monitoringConfig).toHaveProperty('metrics');
      const metrics = monitoringConfig.metrics;
      
      expect(metrics).toHaveProperty('collection');
      expect(metrics.collection).toHaveProperty('interval');
      expect(metrics.collection.interval).toBeLessThanOrEqual(60); // Max 60 seconds
    });

    it('should define critical metrics paths', () => {
      const metrics = monitoringConfig.metrics;
      expect(metrics).toHaveProperty('paths');
      expect(metrics.paths).toContain('api/*');
      expect(metrics.paths).toContain('database/*');
      expect(metrics.paths).toContain('auth/*');
    });

    it('should configure performance metrics', () => {
      const metrics = monitoringConfig.metrics;
      expect(metrics).toHaveProperty('performance');
      expect(metrics.performance).toHaveProperty('responseTime');
      expect(metrics.performance).toHaveProperty('throughput');
      expect(metrics.performance).toHaveProperty('errorRate');
    });
  });

  describe('Alerting System', () => {
    it('should have alert configuration', () => {
      expect(monitoringConfig).toHaveProperty('alerts');
      const alerts = monitoringConfig.alerts;
      
      expect(alerts).toHaveProperty('rules');
      expect(alerts).toHaveProperty('channels');
      expect(alerts).toHaveProperty('responseTime');
    });

    it('should define alert thresholds', () => {
      const alerts = monitoringConfig.alerts;
      expect(alerts.responseTime).toBeLessThanOrEqual(5000); // Max 5 seconds
      expect(alerts).toHaveProperty('errorRateThreshold');
      expect(alerts.errorRateThreshold).toBeLessThanOrEqual(1); // Max 1%
    });

    it('should configure notification channels', () => {
      const channels = monitoringConfig.alerts.channels;
      expect(channels).toContain('email');
      expect(channels).toContain('slack');
    });
  });

  describe('Dashboard Configuration', () => {
    it('should have dashboard settings', () => {
      expect(monitoringConfig).toHaveProperty('dashboard');
      const dashboard = monitoringConfig.dashboard;
      
      expect(dashboard).toHaveProperty('updateFrequency');
      expect(dashboard).toHaveProperty('panels');
      expect(dashboard).toHaveProperty('dataRetention');
    });

    it('should configure real-time updates', () => {
      const dashboard = monitoringConfig.dashboard;
      expect(dashboard.updateFrequency).toBeLessThanOrEqual(30); // Max 30 seconds
    });

    it('should define required dashboard panels', () => {
      const panels = monitoringConfig.dashboard.panels;
      const requiredPanels = [
        'system-health',
        'response-times',
        'error-rates',
        'throughput',
        'resource-usage'
      ];
      
      requiredPanels.forEach(panel => {
        expect(panels).toContain(panel);
      });
    });
  });

  describe('Performance Baselines', () => {
    it('should define performance baselines', () => {
      expect(monitoringConfig).toHaveProperty('baselines');
      const baselines = monitoringConfig.baselines;
      
      expect(baselines).toHaveProperty('responseTime');
      expect(baselines).toHaveProperty('throughput');
      expect(baselines).toHaveProperty('errorRate');
      expect(baselines).toHaveProperty('resourceUsage');
    });

    it('should have reasonable baseline values', () => {
      const baselines = monitoringConfig.baselines;
      expect(baselines.responseTime).toBeLessThanOrEqual(2000); // Max 2 seconds
      expect(baselines.errorRate).toBeLessThanOrEqual(0.5); // Max 0.5%
      expect(baselines.resourceUsage.cpu).toBeLessThanOrEqual(80); // Max 80% CPU
      expect(baselines.resourceUsage.memory).toBeLessThanOrEqual(80); // Max 80% Memory
    });
  });
});