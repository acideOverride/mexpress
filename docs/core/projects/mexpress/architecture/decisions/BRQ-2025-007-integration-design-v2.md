# Event System Integration Architecture Design V2

[Previous sections remain unchanged from BRQ-2025-007-integration-design.md]

## Additional Implementation Guidelines

### 1. Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private failures: number = 0;
  private lastFailure: Date | null = null;
  private readonly threshold: number = 5;
  private readonly resetTimeout: number = 60000; // 1 minute

  async execute<T>(command: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await command();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    if (this.failures >= this.threshold) {
      const now = new Date();
      if (this.lastFailure && now.getTime() - this.lastFailure.getTime() > this.resetTimeout) {
        this.reset();
        return false;
      }
      return true;
    }
    return false;
  }

  private reset(): void {
    this.failures = 0;
    this.lastFailure = null;
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailure = new Date();
  }
}
```

### 2. Rate Limiting
```typescript
interface RateLimitConfig {
  windowMs: number;    // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  strategy: 'fixed' | 'sliding';
}

class RateLimiter {
  private requests: Date[] = [];
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkLimit(): Promise<boolean> {
    this.clearStaleRequests();
    
    if (this.requests.length >= this.config.maxRequests) {
      return false;
    }

    this.requests.push(new Date());
    return true;
  }

  private clearStaleRequests(): void {
    const now = new Date().getTime();
    this.requests = this.requests.filter(time => 
      now - time.getTime() < this.config.windowMs
    );
  }
}
```

### 3. Retry Strategy
```typescript
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBackoff: boolean;
}

class RetryStrategy {
  private readonly config: RetryConfig;

  constructor(config: RetryConfig) {
    this.config = config;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < this.config.maxAttempts) {
          await this.delay(attempt);
        }
      }
    }

    throw lastError;
  }

  private async delay(attempt: number): Promise<void> {
    const delay = this.config.exponentialBackoff
      ? Math.min(this.config.baseDelay * Math.pow(2, attempt - 1), this.config.maxDelay)
      : this.config.baseDelay;

    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
```

### 4. Monitoring Dashboard Specifications

#### Metrics Collection
```typescript
interface DashboardMetrics {
  events: {
    throughput: number;
    latency: number;
    errorRate: number;
    retryRate: number;
  };
  resources: {
    memoryUsage: number;
    cpuUsage: number;
    networkIO: number;
  };
  queues: {
    length: number;
    processingTime: number;
    deadLetters: number;
  };
}

class MetricsDashboard {
  private metrics: DashboardMetrics;
  private readonly updateInterval: number = 5000; // 5 seconds

  constructor() {
    this.initializeMetrics();
    this.startMetricsCollection();
  }

  private initializeMetrics(): void {
    // Initialize empty metrics structure
  }

  private startMetricsCollection(): void {
    setInterval(() => this.collectMetrics(), this.updateInterval);
  }

  private async collectMetrics(): Promise<void> {
    // Collect and update metrics
  }

  public getMetrics(): DashboardMetrics {
    return this.metrics;
  }

  public setAlert(metric: keyof DashboardMetrics, threshold: number): void {
    // Set up alerting
  }
}
```

## Integration Example with All Patterns

```typescript
@Injectable()
class IntegrationService {
  constructor(
    private eventService: CatalogEventService,
    private circuitBreaker: CircuitBreaker,
    private rateLimiter: RateLimiter,
    private retryStrategy: RetryStrategy,
    private monitoring: MetricsDashboard
  ) {
    this.setupService();
  }

  private async setupService(): Promise<void> {
    // Configure circuit breaker
    const breaker = new CircuitBreaker();

    // Configure rate limiter
    const limiter = new RateLimiter({
      windowMs: 60000,
      maxRequests: 1000,
      strategy: 'sliding'
    });

    // Configure retry strategy
    const retry = new RetryStrategy({
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      exponentialBackoff: true
    });

    // Setup event handling with all patterns
    this.eventService.onProductCreated(async (event) => {
      if (await limiter.checkLimit()) {
        await breaker.execute(async () => {
          await retry.execute(async () => {
            await this.handleProductCreated(event);
          });
        });
      }
    });
  }

  private async handleProductCreated(event: ProductCreatedEvent): Promise<void> {
    const startTime = Date.now();
    try {
      // Handle event
      const processingTime = Date.now() - startTime;
      this.monitoring.getMetrics().events.latency = processingTime;
    } catch (error) {
      this.monitoring.getMetrics().events.errorRate++;
      throw error;
    }
  }
}
```

[Rest of the document remains unchanged]