import { MonitoringSystem, MetricType } from '../monitoring';
import { jest } from '@jest/globals';

describe('MonitoringSystem', () => {
    let monitoring: MonitoringSystem;

    beforeEach(() => {
        monitoring = new MonitoringSystem();
    });

    describe('metrics', () => {
        it('should record counter metrics', async () => {
            // Arrange
            const name = 'api_requests_total';
            const labels = { service: 'hiboutik', endpoint: '/orders' };
            
            // Act
            await monitoring.incrementCounter(name, labels);
            const metric = await monitoring.getMetric(name, labels);

            // Assert
            expect(metric).toBeDefined();
            expect(metric?.value).toBe(1);
            expect(metric?.type).toBe(MetricType.Counter);
        });

        it('should record gauge metrics', async () => {
            // Arrange
            const name = 'circuit_breaker_state';
            const labels = { service: 'ringover' };
            const value = 1;
            
            // Act
            await monitoring.setGauge(name, value, labels);
            const metric = await monitoring.getMetric(name, labels);

            // Assert
            expect(metric).toBeDefined();
            expect(metric?.value).toBe(value);
            expect(metric?.type).toBe(MetricType.Gauge);
        });

        it('should record histogram metrics', async () => {
            // Arrange
            const name = 'api_response_time';
            const labels = { service: 'hiboutik' };
            const value = 123;
            
            // Act
            await monitoring.observeHistogram(name, value, labels);
            const metric = await monitoring.getMetric(name, labels);

            // Assert
            expect(metric).toBeDefined();
            expect(metric?.value).toBe(value);
            expect(metric?.type).toBe(MetricType.Histogram);
        });
    });

    describe('health checks', () => {
        it('should register health check', async () => {
            // Arrange
            const name = 'hiboutik_api';
            const check = jest.fn<() => Promise<boolean>>().mockResolvedValue(true);
            
            // Act
            monitoring.registerHealthCheck(name, check);
            const result = await monitoring.runHealthChecks();

            // Assert
            expect(result[name]).toBe(true);
            expect(check).toHaveBeenCalled();
        });

        it('should handle failed health checks', async () => {
            // Arrange
            const name = 'ringover_api';
            const error = new Error('API unavailable');
            const check = jest.fn<() => Promise<boolean>>().mockRejectedValue(error);
            
            // Act
            monitoring.registerHealthCheck(name, check);
            const result = await monitoring.runHealthChecks();

            // Assert
            expect(result[name]).toBe(false);
            expect(check).toHaveBeenCalled();
        });
    });

    describe('alerts', () => {
        it('should trigger alert when threshold exceeded', async () => {
            // Arrange
            const name = 'error_rate';
            const threshold = 0.1;
            const alertCallback = jest.fn();
            
            monitoring.registerAlert(name, threshold, alertCallback);
            
            // Act
            await monitoring.setGauge(name, 0.15);
            await monitoring.checkAlerts();

            // Assert
            expect(alertCallback).toHaveBeenCalledWith({
                name,
                value: 0.15,
                threshold,
                timestamp: expect.any(Number)
            });
        });

        it('should not trigger alert when under threshold', async () => {
            // Arrange
            const name = 'error_rate';
            const threshold = 0.1;
            const alertCallback = jest.fn();
            
            monitoring.registerAlert(name, threshold, alertCallback);
            
            // Act
            await monitoring.setGauge(name, 0.05);
            await monitoring.checkAlerts();

            // Assert
            expect(alertCallback).not.toHaveBeenCalled();
        });
    });

    describe('prometheus format', () => {
        it('should output metrics in prometheus format', async () => {
            // Arrange
            await monitoring.incrementCounter('http_requests_total', { method: 'GET', status: '200' });
            await monitoring.setGauge('system_memory_usage', 0.75, { type: 'heap' });
            
            // Act
            const output = await monitoring.getPrometheusMetrics();

            // Assert
            expect(output).toContain('# HELP http_requests_total Total HTTP requests');
            expect(output).toContain('# TYPE http_requests_total counter');
            expect(output).toContain('http_requests_total{method="GET",status="200"} 1');
            expect(output).toContain('# HELP system_memory_usage System memory usage');
            expect(output).toContain('# TYPE system_memory_usage gauge');
            expect(output).toContain('system_memory_usage{type="heap"} 0.75');
        });
    });
});