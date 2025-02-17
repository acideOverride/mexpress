import { TimeProvider, TestTimeProvider } from '../../../src/core/time/time-provider';

describe('TimeProvider', () => {
  // Explicitly type the provider to show we're testing the interface
  let timeProvider: TimeProvider & TestTimeProvider;

  beforeEach(() => {
    timeProvider = new TestTimeProvider();
  });

  describe('setTimeout', () => {
    it('should schedule a callback for future execution', () => {
      const callback = jest.fn();
      const delay = 1000;

      const timeoutId = timeProvider.setTimeout(callback, delay);

      expect(timeoutId).toBe(1);
      expect(callback).not.toHaveBeenCalled();

      timeProvider.advance(delay);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should throw TypeError for non-function callback', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        timeProvider.setTimeout('not a function', 1000);
      }).toThrow(TypeError);
    });

    it('should throw RangeError for negative delay', () => {
      expect(() => {
        timeProvider.setTimeout(() => {}, -1000);
      }).toThrow(RangeError);
    });

    it('should execute callbacks in correct order', () => {
      const order: number[] = [];
      timeProvider.setTimeout(() => order.push(2), 1000);
      timeProvider.setTimeout(() => order.push(1), 500);
      timeProvider.setTimeout(() => order.push(3), 1500);

      timeProvider.advance(2000);
      expect(order).toEqual([1, 2, 3]);
    });
  });

  describe('clearTimeout', () => {
    it('should cancel scheduled callback', () => {
      const callback = jest.fn();
      const timeoutId = timeProvider.setTimeout(callback, 1000);

      timeProvider.clearTimeout(timeoutId);
      timeProvider.advance(1000);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle clearing invalid timeout ID', () => {
      expect(() => {
        timeProvider.clearTimeout(999);
      }).not.toThrow();
    });

    it('should handle clearing timeout multiple times', () => {
      const timeoutId = timeProvider.setTimeout(() => {}, 1000);

      expect(() => {
        timeProvider.clearTimeout(timeoutId);
        timeProvider.clearTimeout(timeoutId);
      }).not.toThrow();
    });
  });

  describe('now', () => {
    it('should return current time', () => {
      expect(timeProvider.now()).toBe(0);
      
      timeProvider.advance(1000);
      expect(timeProvider.now()).toBe(1000);

      timeProvider.advance(500);
      expect(timeProvider.now()).toBe(1500);
    });

    it('should maintain consistent time across operations', () => {
      const startTime = timeProvider.now();
      timeProvider.setTimeout(() => {}, 1000);
      expect(timeProvider.now()).toBe(startTime);

      timeProvider.advance(500);
      expect(timeProvider.now()).toBe(startTime + 500);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple timeouts at same time', () => {
      const callbacks = [jest.fn(), jest.fn(), jest.fn()];
      callbacks.forEach(cb => timeProvider.setTimeout(cb, 1000));

      timeProvider.advance(1000);
      callbacks.forEach(cb => expect(cb).toHaveBeenCalledTimes(1));
    });

    it('should handle zero delay timeout', () => {
      const callback = jest.fn();
      timeProvider.setTimeout(callback, 0);

      expect(callback).not.toHaveBeenCalled();
      timeProvider.advance(0);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle maximum safe integer delay', () => {
      const callback = jest.fn();
      const maxDelay = Number.MAX_SAFE_INTEGER;

      const timeoutId = timeProvider.setTimeout(callback, maxDelay);
      expect(timeoutId).toBe(1);
      expect(callback).not.toHaveBeenCalled();

      timeProvider.advance(maxDelay);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});