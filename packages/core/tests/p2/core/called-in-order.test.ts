/**
 * Tests for the calledInOrder utility function
 */

// Node.js assert module
import assert from 'assert';
import calledInOrder, { Spy, SpyCall } from './called-in-order';

describe("calledInOrder", () => {
  // Test utility to create spies with predefined callIds
  function createSpy(callId: number): Spy {
    return {
      called: true,
      getCall: function(index: number): SpyCall | null {
        if (index === 0) {
          return { callId };
        }
        return null;
      }
    };
  }
  
  describe("in-order calls", () => {
    it("should return true for consecutive callIds", () => {
      const spy1 = createSpy(1);
      const spy2 = createSpy(2);
      const spy3 = createSpy(3);
      
      assert.strictEqual(calledInOrder([spy1, spy2]), true);
      assert.strictEqual(calledInOrder([spy1, spy2, spy3]), true);
      assert.strictEqual(calledInOrder(spy1, spy2), true);
      assert.strictEqual(calledInOrder(spy1, spy2, spy3), true);
    });
  });
  
  describe("out-of-order calls", () => {
    it("should return false for out-of-order callIds", () => {
      const spy1 = createSpy(2);
      const spy2 = createSpy(1);
      
      assert.strictEqual(calledInOrder([spy1, spy2]), false);
      assert.strictEqual(calledInOrder(spy1, spy2), false);
    });
  });
  
  describe("edge cases", () => {
    it("should handle empty or single-element arrays", () => {
      const spy = createSpy(1);
      
      assert.strictEqual(calledInOrder([]), true);
      assert.strictEqual(calledInOrder([spy]), true);
      assert.strictEqual(calledInOrder(), true);
      assert.strictEqual(calledInOrder(spy), true);
    });
    
    it("should handle uncalled spies", () => {
      const calledSpy = createSpy(1);
      const uncalledSpy: Spy = { called: false, getCall: () => null };
      
      assert.strictEqual(calledInOrder([uncalledSpy, calledSpy]), false);
      assert.strictEqual(calledInOrder([calledSpy, uncalledSpy]), false);
    });
  });
});