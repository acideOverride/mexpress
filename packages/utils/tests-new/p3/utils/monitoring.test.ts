import { MetricsCollector, MetricData } from '../monitoring';

describe('MetricsCollector', () => {
  let collector: MetricsCollector;

  beforeEach(() => {
    collector = new MetricsCollector();
  });

  describe('recordMetric', () => {
    it('should record a metric with timestamp', () => {
      const metric: MetricData = {
        name: 'test-metric',
        value: 100,
        timestamp: Date.now()
      };

      collector.recordMetric(metric);
      const metrics = collector.getMetrics();

      expect(metrics).toHaveLength(1);
      expect(metrics[0]).toEqual(metric);
    });

    it('should add timestamp if not provided', () => {
      const metric: MetricData = {
        name: 'test-metric',
        value: 100,
        timestamp: 0
      };

      collector.recordMetric(metric);
      const metrics = collector.getMetrics();

      expect(metrics[0].timestamp).toBeGreaterThan(0);
    });

    it('should record metrics with tags', () => {
      const metric: MetricData = {
        name: 'test-metric',
        value: 100,
        timestamp: Date.now(),
        tags: {
          environment: 'test',
          service: 'api'
        }
      };

      collector.recordMetric(metric);
      const metrics = collector.getMetrics();

      expect(metrics[0].tags).toEqual(metric.tags);
    });
  });

  describe('getMetrics', () => {
    it('should return all recorded metrics', () => {
      const metrics: MetricData[] = [
        { name: 'metric1', value: 100, timestamp: Date.now() },
        { name: 'metric2', value: 200, timestamp: Date.now() }
      ];

      metrics.forEach(m => collector.recordMetric(m));
      const result = collector.getMetrics();

      expect(result).toHaveLength(2);
      expect(result).toEqual(metrics);
    });

    it('should return empty array when no metrics recorded', () => {
      const metrics = collector.getMetrics();
      expect(metrics).toHaveLength(0);
    });
  });

  describe('clearMetrics', () => {
    it('should clear all recorded metrics', () => {
      const metric: MetricData = {
        name: 'test-metric',
        value: 100,
        timestamp: Date.now()
      };

      collector.recordMetric(metric);
      expect(collector.getMetrics()).toHaveLength(1);

      collector.clearMetrics();
      expect(collector.getMetrics()).toHaveLength(0);
    });
  });

  describe('getAverageValue', () => {
    it('should calculate average for specified metric', () => {
      const metrics: MetricData[] = [
        { name: 'cpu', value: 50, timestamp: Date.now() },
        { name: 'cpu', value: 60, timestamp: Date.now() },
        { name: 'memory', value: 80, timestamp: Date.now() }
      ];

      metrics.forEach(m => collector.recordMetric(m));
      const avgCpu = collector.getAverageValue('cpu');

      expect(avgCpu).toBe(55);
    });

    it('should return 0 when no metrics found', () => {
      const avg = collector.getAverageValue('non-existent');
      expect(avg).toBe(0);
    });
  });

  describe('getLatestValue', () => {
    it('should return latest value for specified metric', () => {
      const now = Date.now();
      const metrics: MetricData[] = [
        { name: 'cpu', value: 50, timestamp: now - 2000 },
        { name: 'cpu', value: 60, timestamp: now - 1000 },
        { name: 'cpu', value: 70, timestamp: now }
      ];

      metrics.forEach(m => collector.recordMetric(m));
      const latest = collector.getLatestValue('cpu');

      expect(latest).toBe(70);
    });

    it('should return null when no metrics found', () => {
      const latest = collector.getLatestValue('non-existent');
      expect(latest).toBeNull();
    });
  });
});