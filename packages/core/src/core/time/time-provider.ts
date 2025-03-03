/**
 * TimeProvider interface for abstracting time-related functions.
 * Useful for testing time-dependent code.
 */
export interface TimeProvider {
  /**
   * Returns the current time in milliseconds.
   */
  now(): number;
  
  /**
   * Schedules a callback to be executed after a specified delay.
   * @param callback The function to execute.
   * @param delay The delay in milliseconds.
   * @returns A unique identifier that can be used to cancel the timeout.
   */
  setTimeout(callback: () => void, delay: number): number;
  
  /**
   * Cancels a previously scheduled timeout.
   * @param id The identifier returned by setTimeout.
   */
  clearTimeout(id: number): void;
}

/**
 * Test implementation of TimeProvider that allows for controlled time manipulation.
 * This is useful for testing time-dependent code without having to wait for real time to pass.
 */
export class TestTimeProvider implements TimeProvider {
  private currentTime: number = 0;
  private timeouts: Map<number, { callback: () => void; scheduledTime: number }> = new Map();
  private nextTimeoutId: number = 1;

  /**
   * Returns the current simulated time in milliseconds.
   */
  now(): number {
    return this.currentTime;
  }

  /**
   * Schedules a callback to be executed after a specified delay.
   * @param callback The function to execute.
   * @param delay The delay in milliseconds.
   * @returns A unique identifier that can be used to cancel the timeout.
   * @throws TypeError if callback is not a function.
   * @throws RangeError if delay is negative.
   */
  setTimeout(callback: () => void, delay: number): number {
    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function');
    }
    
    if (delay < 0) {
      throw new RangeError('Timeout delay cannot be negative');
    }
    
    const id = this.nextTimeoutId++;
    const scheduledTime = this.currentTime + delay;
    
    this.timeouts.set(id, { callback, scheduledTime });
    return id;
  }

  /**
   * Cancels a previously scheduled timeout.
   * @param id The identifier returned by setTimeout.
   */
  clearTimeout(id: number): void {
    this.timeouts.delete(id);
  }

  /**
   * Advances the simulated time by the specified duration and executes any timeouts that have expired.
   * @param duration The number of milliseconds to advance the time by.
   */
  advance(duration: number): void {
    const targetTime = this.currentTime + duration;
    
    // Find all timeouts that should be executed before the target time
    // and sort them by scheduled time
    const timeoutsToExecute = Array.from(this.timeouts.entries())
      .filter(([_, { scheduledTime }]) => scheduledTime <= targetTime)
      .sort((a, b) => a[1].scheduledTime - b[1].scheduledTime);
    
    // Execute timeouts and update current time
    for (const [id, { callback, scheduledTime }] of timeoutsToExecute) {
      this.currentTime = scheduledTime;
      this.timeouts.delete(id);
      
      // Execute the callback and allow any errors to propagate
      callback();
    }
    
    // Set the current time to the target time
    this.currentTime = targetTime;
  }
}