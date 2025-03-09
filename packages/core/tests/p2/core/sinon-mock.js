"use strict";

/**
 * A simplified sinon mock for testing purposes
 */

// Global counter for all stubs to establish call order
var callCounter = 0;

// Reset counter before each test
beforeEach(function() {
  callCounter = 0;
});

/**
 * Stub replacement function
 */
function createStub(obj, method) {
  // Store original method
  const original = obj[method];
  
  // Create call tracking
  const calls = [];
  
  // Create stub function
  const stub = function() {
    const callId = callCounter++;
    const call = {
      args: Array.prototype.slice.call(arguments),
      callId: callId
    };
    calls.push(call);
    stub.called = true;
    stub.callCount++;
    return stub.returnValue;
  };
  
  // Setup stub properties
  stub.called = false;
  stub.callCount = 0;
  stub.returnValue = undefined;
  stub.calls = calls;
  
  // Helper methods
  stub.getCall = function(idx) {
    return calls[idx] || null;
  };
  
  stub.calledBefore = function(otherStub) {
    if (!stub.called || !otherStub.called) {
      return false;
    }
    return stub.getCall(0).callId < otherStub.getCall(0).callId;
  };
  
  // Restore method
  stub.restore = function() {
    obj[method] = original;
  };
  
  // Replace original method with stub
  obj[method] = stub;
  
  return stub;
}

// Sinon mock
const sinon = {
  stub: function(obj, method) {
    return createStub(obj, method);
  }
};

// Referee-sinon mock
const assert = {
  isTrue: function(value) {
    if (value !== true) {
      throw new Error(`Expected true but got ${value}`);
    }
  },
  isFalse: function(value) {
    if (value !== false) {
      throw new Error(`Expected false but got ${value}`);
    }
  }
};

module.exports = {
  sinon: sinon,
  assert: assert
};