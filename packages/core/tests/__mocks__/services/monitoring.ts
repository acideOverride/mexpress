export class MonitoringSystem {
  private metrics: Record<string, number> = {};
  private logs: Array<{ level: string; message: string; meta?: Record<string, any> }> = [];

  async incrementCounter(name: string, labels: Record<string, string> = {}): Promise<void> {
    const key = this.formatKey(name, labels);
    this.metrics[key] = (this.metrics[key] || 0) + 1;
  }

  async setGauge(name: string, value: number, labels: Record<string, string> = {}): Promise<void> {
    const key = this.formatKey(name, labels);
    this.metrics[key] = value;
  }

  async startTimer(name: string, labels: Record<string, string> = {}): Promise<() => void> {
    const startTime = Date.now();
    return async () => {
      const duration = Date.now() - startTime;
      const key = this.formatKey(name, labels);
      this.metrics[key] = duration;
    };
  }

  async logInfo(message: string, meta?: Record<string, any>): Promise<void> {
    this.logs.push({ level: 'info', message, meta });
  }

  async logError(message: string, meta?: Record<string, any>): Promise<void> {
    this.logs.push({ level: 'error', message, meta });
  }

  getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }

  getLogs(): Array<{ level: string; message: string; meta?: Record<string, any> }> {
    return [...this.logs];
  }

  clearData(): void {
    this.metrics = {};
    this.logs = [];
  }

  private formatKey(name: string, labels: Record<string, string>): string {
    if (Object.keys(labels).length === 0) {
      return name;
    }
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return `${name}{${labelStr}}`;
  }
}