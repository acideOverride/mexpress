export interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export class MetricsCollector {
  private metrics: MetricData[] = [];

  public recordMetric(data: MetricData): void {
    this.metrics.push({
      ...data,
      timestamp: data.timestamp || Date.now()
    });
  }

  public getMetrics(): MetricData[] {
    return this.metrics;
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public getAverageValue(metricName: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === metricName);
    if (relevantMetrics.length === 0) return 0;
    
    const sum = relevantMetrics.reduce((acc, curr) => acc + curr.value, 0);
    return sum / relevantMetrics.length;
  }

  public getLatestValue(metricName: string): number | null {
    const relevantMetrics = this.metrics
      .filter(m => m.name === metricName)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return relevantMetrics[0]?.value ?? null;
  }
}