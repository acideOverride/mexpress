/**
 * Simple mock for referee's refute functionality
 */
export interface Refute {
  exception: (fn: () => void) => boolean;
}

const refute: Refute = {
  exception: function(fn: () => void): boolean {
    try {
      fn();
      // If no exception, test passes
      return true;
    } catch (e) {
      // If exception, test fails
      const error = e as Error;
      throw new Error("Expected no exception, but got: " + error.message);
    }
  }
};

export { refute };