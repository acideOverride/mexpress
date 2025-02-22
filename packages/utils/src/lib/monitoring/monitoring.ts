/**
 * Types of metrics supported by the monitoring system
 */
export enum MetricType {
    Counter = 'counter',
    Gauge = 'gauge',
    Histogram = 'histogram'
}

interface Metric {
    name: string;
    type: MetricType;
    value: number;
    labels: Record<string, string>;
    help?: string;
    timestamp: number;
}

interface Alert {
    name: string;
    threshold: number;
    callback: (alert: AlertInfo) => void;
}

interface AlertInfo {
    name: string;
    value: number;
    threshold: number;
    timestamp: number;
}

type HealthCheck = () => Promise<boolean>;

/**
 * Monitoring system for tracking metrics, health checks, and alerts
 */
export class MonitoringSystem {
    private metrics: Map<string, Metric> = new Map();
    private healthChecks: Map<string, HealthCheck> = new Map();
    private alerts: Map<string, Alert> = new Map();
    private helpTexts: Map<string, string> = new Map();

    constructor() {
        // Initialize default help texts
        this.helpTexts.set('http_requests_total', 'Total HTTP requests');
        this.helpTexts.set('system_memory_usage', 'System memory usage');
    }

    /**
     * Get metric key from name and labels
     */
    private getMetricKey(name: string, labels: Record<string, string> = {}): string {
        const labelStr = Object.entries(labels)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}="${v}"`)
            .join(',');
        return labelStr ? `${name}{${labelStr}}` : name;
    }

    /**
     * Increment a counter metric
     */
    async incrementCounter(name: string, labels: Record<string, string> = {}): Promise<void> {
        const key = this.getMetricKey(name, labels);
        const existing = this.metrics.get(key);
        
        if (existing && existing.type !== MetricType.Counter) {
            throw new Error(`Metric ${name} exists with different type: ${existing.type}`);
        }

        this.metrics.set(key, {
            name,
            type: MetricType.Counter,
            value: (existing?.value || 0) + 1,
            labels,
            timestamp: Date.now()
        });
    }

    /**
     * Set a gauge metric value
     */
    async setGauge(name: string, value: number, labels: Record<string, string> = {}): Promise<void> {
        const key = this.getMetricKey(name, labels);
        const existing = this.metrics.get(key);
        
        if (existing && existing.type !== MetricType.Gauge) {
            throw new Error(`Metric ${name} exists with different type: ${existing.type}`);
        }

        this.metrics.set(key, {
            name,
            type: MetricType.Gauge,
            value,
            labels,
            timestamp: Date.now()
        });
    }

    /**
     * Observe a value for a histogram metric
     */
    async observeHistogram(name: string, value: number, labels: Record<string, string> = {}): Promise<void> {
        const key = this.getMetricKey(name, labels);
        const existing = this.metrics.get(key);
        
        if (existing && existing.type !== MetricType.Histogram) {
            throw new Error(`Metric ${name} exists with different type: ${existing.type}`);
        }

        this.metrics.set(key, {
            name,
            type: MetricType.Histogram,
            value,
            labels,
            timestamp: Date.now()
        });
    }

    /**
     * Get a specific metric
     */
    async getMetric(name: string, labels: Record<string, string> = {}): Promise<Metric | undefined> {
        const key = this.getMetricKey(name, labels);
        return this.metrics.get(key);
    }

    /**
     * Register a health check function
     */
    registerHealthCheck(name: string, check: HealthCheck): void {
        this.healthChecks.set(name, check);
    }

    /**
     * Run all registered health checks
     */
    async runHealthChecks(): Promise<Record<string, boolean>> {
        const results: Record<string, boolean> = {};
        
        for (const [name, check] of this.healthChecks) {
            try {
                results[name] = await check();
            } catch (error) {
                results[name] = false;
            }
        }
        
        return results;
    }

    /**
     * Register an alert for a metric
     */
    registerAlert(name: string, threshold: number, callback: (alert: AlertInfo) => void): void {
        this.alerts.set(name, { name, threshold, callback });
    }

    /**
     * Check all registered alerts
     */
    async checkAlerts(): Promise<void> {
        for (const [name, alert] of this.alerts) {
            const metric = await this.getMetric(name);
            if (metric && metric.value > alert.threshold) {
                alert.callback({
                    name,
                    value: metric.value,
                    threshold: alert.threshold,
                    timestamp: Date.now()
                });
            }
        }
    }

    /**
     * Get metrics in Prometheus format
     */
    async getPrometheusMetrics(): Promise<string> {
        const output: string[] = [];
        const metricsByName = new Map<string, Metric[]>();

        // Group metrics by name
        for (const metric of this.metrics.values()) {
            const metrics = metricsByName.get(metric.name) || [];
            metrics.push(metric);
            metricsByName.set(metric.name, metrics);
        }

        // Generate output in Prometheus format
        for (const [name, metrics] of metricsByName) {
            const type = metrics[0].type;
            const help = this.helpTexts.get(name) || `${name} ${type}`;

            output.push(`# HELP ${name} ${help}`);
            output.push(`# TYPE ${name} ${type}`);

            for (const metric of metrics) {
                const labels = Object.entries(metric.labels)
                    .map(([k, v]) => `${k}="${v}"`)
                    .join(',');
                const value = metric.value;
                output.push(`${name}${labels ? `{${labels}}` : ''} ${value}`);
            }
        }

        return output.join('\n');
    }
}