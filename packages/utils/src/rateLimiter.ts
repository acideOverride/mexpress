/**
 * Simple token bucket rate limiter
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number;

  /**
   * Create a new rate limiter
   * @param maxRequests Maximum number of requests per time window
   * @param timeWindow Time window in milliseconds
   */
  constructor(maxRequests: number, timeWindow: number) {
    this.maxTokens = maxRequests;
    this.tokens = maxRequests;
    this.lastRefill = Date.now();
    this.refillRate = timeWindow / maxRequests;
  }

  /**
   * Acquire a token for making a request
   * Returns a promise that resolves when a token is available
   */
  async acquire(): Promise<void> {
    await this.refill();
    
    if (this.tokens <= 0) {
      // Calculate delay needed for next token
      const delay = this.refillRate - (Date.now() - this.lastRefill);
      await new Promise(resolve => setTimeout(resolve, delay));
      await this.refill();
    }

    this.tokens--;
  }

  /**
   * Refill tokens based on elapsed time
   */
  private async refill(): Promise<void> {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const newTokens = Math.floor(timePassed / this.refillRate);

    if (newTokens > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
      this.lastRefill = now;
    }
  }
}