/**
 * A simple token bucket rate limiter
 */
export class RateLimiter {
  private tokens: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per ms
  private lastRefill: number;
  
  /**
   * Creates a new rate limiter
   * @param requestsPerInterval Maximum number of requests allowed in the time interval
   * @param interval Time interval in milliseconds
   */
  constructor(requestsPerInterval: number, interval: number) {
    this.maxTokens = requestsPerInterval;
    this.tokens = requestsPerInterval;
    this.refillRate = requestsPerInterval / interval;
    this.lastRefill = Date.now();
  }
  
  /**
   * Refills the token bucket based on time elapsed
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    
    if (elapsed > 0) {
      // Calculate how many tokens to add based on time passed
      const tokensToAdd = elapsed * this.refillRate;
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }
  
  /**
   * Acquires a token, waiting if necessary
   * @returns Promise that resolves when a token is acquired
   */
  async acquire(): Promise<void> {
    this.refill();
    
    if (this.tokens >= 1) {
      // We have a token available, consume it immediately
      this.tokens -= 1;
      return Promise.resolve();
    }
    
    // Calculate wait time until next token is available
    const waitTime = Math.ceil((1 - this.tokens) / this.refillRate);
    
    // Wait for the required time
    return new Promise(resolve => {
      setTimeout(() => {
        this.tokens = 0; // Consumed the token that became available
        resolve();
      }, waitTime);
    });
  }
  
  /**
   * Returns current token count (for testing/debugging)
   */
  getTokenCount(): number {
    this.refill();
    return this.tokens;
  }
}