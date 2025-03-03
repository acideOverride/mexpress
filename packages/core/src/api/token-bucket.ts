/**
 * TokenBucket implementation for precise rate limiting
 * Using the token bucket algorithm for fair and efficient rate limiting
 */
export class TokenBucket {
  private tokens: number;
  private lastRefillTimestamp: number;
  private readonly capacity: number;
  private readonly refillRate: number; // tokens per second

  /**
   * Create a new token bucket
   * @param capacity The maximum number of tokens the bucket can hold
   * @param refillRate The number of tokens to add per second
   * @param initialTokens Initial number of tokens (defaults to capacity)
   */
  constructor(capacity: number, refillRate: number, initialTokens?: number) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = initialTokens !== undefined ? initialTokens : capacity;
    this.lastRefillTimestamp = Date.now();
  }

  /**
   * Refill the bucket based on elapsed time
   * @private
   */
  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    
    if (elapsedSeconds > 0) {
      // Calculate new tokens to add based on time elapsed
      const newTokens = elapsedSeconds * this.refillRate;
      
      // Update token count, ensuring we don't exceed capacity
      this.tokens = Math.min(this.capacity, this.tokens + newTokens);
      
      // Update the last refill timestamp
      this.lastRefillTimestamp = now;
    }
  }

  /**
   * Try to consume tokens from the bucket
   * @param count Number of tokens to consume (default: 1)
   * @returns true if tokens were consumed, false if insufficient tokens
   */
  public tryConsume(count: number = 1): boolean {
    // First refill the bucket based on elapsed time
    this.refill();
    
    // Check if we have enough tokens
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    
    return false;
  }

  /**
   * Consume tokens from the bucket, waiting if necessary
   * @param count Number of tokens to consume (default: 1)
   * @returns Promise that resolves when tokens are consumed
   */
  public async consume(count: number = 1): Promise<void> {
    // First try to consume immediately
    if (this.tryConsume(count)) {
      return;
    }
    
    // Calculate how long to wait for enough tokens
    this.refill(); // Make sure we're up to date
    const tokensNeeded = count - this.tokens;
    const waitTimeMs = (tokensNeeded / this.refillRate) * 1000;
    
    // Wait for the calculated time
    await new Promise(resolve => setTimeout(resolve, waitTimeMs));
    
    // After waiting, try to consume again
    if (!this.tryConsume(count)) {
      // If we still can't consume, retry recursively
      // This should be rare but handles edge cases
      return this.consume(count);
    }
  }

  /**
   * Get the current number of tokens in the bucket
   * @returns Current token count
   */
  public getTokens(): number {
    this.refill();
    return this.tokens;
  }

  /**
   * Reset the bucket to its initial state
   * @param initialTokens Initial tokens (defaults to capacity)
   */
  public reset(initialTokens?: number): void {
    this.tokens = initialTokens !== undefined ? initialTokens : this.capacity;
    this.lastRefillTimestamp = Date.now();
  }
}