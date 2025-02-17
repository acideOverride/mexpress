/**
 * TimeProvider Interface
 * 
 * Provides an abstraction for time-based operations to support both real-time
 * and test scenarios. This interface allows for consistent time management
 * across the application while enabling deterministic testing.
 */
export interface TimeProvider {
  /**
   * Schedules a callback to be executed after a specified delay.
   * 
   * @param callback - The function to be executed after the delay
   * @param ms - The delay in milliseconds
   * @returns A timeout ID that can be used to cancel the timeout
   * 
   * @throws {TypeError} If callback is not a function
   * @throws {RangeError} If ms is negative
   */
  setTimeout(callback: () => void, ms: number): number;

  /**
   * Cancels a timeout previously scheduled with setTimeout.
   * 
   * @param id - The timeout ID returned by setTimeout
   */
  clearTimeout(id: number): void;

  /**
   * Returns the current timestamp in milliseconds.
   * 
   * @returns The current time in milliseconds since the Unix epoch
   */
  now(): number;
}

/**
 * Test implementation of TimeProvider for validation
 */
export class TestTimeProvider implements TimeProvider {
  private currentTime: number = 0;
  private timeouts: Map<number, { callback: () => void; time: number }> = new Map();
  private nextTimeoutId: number = 1;

  setTimeout(callback: () => void, ms: number): number {
    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function');
    }
    if (ms < 0) {
      throw new RangeError('Timeout delay cannot be negative');
    }
    const id = this.nextTimeoutId++;
    this.timeouts.set(id, { callback, time: this.currentTime + ms });
    return id;
  }

  clearTimeout(id: number): void {
    this.timeouts.delete(id);
  }

  now(): number {
    return this.currentTime;
  }

  /**
   * Test helper to advance time and execute any timeouts that have been reached.
   * Timeouts are executed in order of their scheduled time.
   * 
   * @param ms - The number of milliseconds to advance time by
   */
  advance(ms: number): void {
      const targetTime = this.currentTime + ms;
      
      // Collect and sort timeouts that should be executed
      const timeoutsToExecute = Array.from(this.timeouts.entries())
        .filter(([_, timeout]) => timeout.time <= targetTime)
        .sort((a, b) => a[1].time - b[1].time);

      // Execute timeouts in order, updating time for each callback
      for (const [id, timeout] of timeoutsToExecute) {
          this.currentTime = timeout.time;
          try {
              timeout.callback();
          } catch (error) {
              this.timeouts.delete(id);
              throw error;
          }
          this.timeouts.delete(id);
      }

      // Set final time after all executions
      this.currentTime = targetTime;
  }
}