"use strict";

// We'll use standard Node.js assert
var assert = require("assert");

/**
 * Utility to determine if spies were called in order
 */
function calledInOrder(spies) {
  // Handle arguments object
  if (arguments.length > 1) {
    spies = Array.prototype.slice.call(arguments);
  }
  
  // Empty or single spy always returns true
  if (!spies || !spies.length || spies.length < 2) {
    return true;
  }
  
  // Check each consecutive pair of spies
  for (var i = 0; i < spies.length - 1; i++) {
    var first = spies[i];
    var second = spies[i + 1];
    
    // If any spy wasn't called, return false
    if (!first.called || !second.called) {
      return false;
    }
    
    // Get the first call for each spy
    var firstCall = first.getCall(0);
    var secondCall = second.getCall(0);
    
    // If any call can't be retrieved, or if the first call doesn't happen before the second,
    // return false
    if (!firstCall || !secondCall || firstCall.callId >= secondCall.callId) {
      return false;
    }
  }
  
  return true;
}

describe("calledInOrder", function() {
  // Test utility to create spies with predefined callIds
  function createSpy(callId) {
    return {
      called: true,
      getCall: function(index) {
        if (index === 0) {
          return { callId: callId };
        }
        return null;
      }
    };
  }
  
  describe("in-order calls", function() {
    it("should return true for consecutive callIds", function() {
      var spy1 = createSpy(1);
      var spy2 = createSpy(2);
      var spy3 = createSpy(3);
      
      assert.strictEqual(calledInOrder([spy1, spy2]), true);
      assert.strictEqual(calledInOrder([spy1, spy2, spy3]), true);
      assert.strictEqual(calledInOrder(spy1, spy2), true);
      assert.strictEqual(calledInOrder(spy1, spy2, spy3), true);
    });
  });
  
  describe("out-of-order calls", function() {
    it("should return false for out-of-order callIds", function() {
      var spy1 = createSpy(2);
      var spy2 = createSpy(1);
      
      assert.strictEqual(calledInOrder([spy1, spy2]), false);
      assert.strictEqual(calledInOrder(spy1, spy2), false);
    });
  });
  
  describe("edge cases", function() {
    it("should handle empty or single-element arrays", function() {
      var spy = createSpy(1);
      
      assert.strictEqual(calledInOrder([]), true);
      assert.strictEqual(calledInOrder([spy]), true);
      assert.strictEqual(calledInOrder(), true);
      assert.strictEqual(calledInOrder(spy), true);
    });
    
    it("should handle uncalled spies", function() {
      var calledSpy = createSpy(1);
      var uncalledSpy = { called: false };
      
      assert.strictEqual(calledInOrder([uncalledSpy, calledSpy]), false);
      assert.strictEqual(calledInOrder([calledSpy, uncalledSpy]), false);
    });
  });
});

// Export for use in other tests
module.exports = calledInOrder;