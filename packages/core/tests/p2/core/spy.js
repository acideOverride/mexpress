"use strict";

// Shared counter across all spies to simulate unique callIds
var globalCounter = 0;

/**
 * A very simple spy implementation for testing
 * This is a much simplified version of the Sinon spy
 */
function createSpy() {
    var callCount = 0;
    var calls = [];
    var wasCalled = false;

    function spy() {
        wasCalled = true;
        var call = {
            callId: globalCounter++, // Use global counter for unique callIds
            args: Array.prototype.slice.call(arguments)
        };
        calls.push(call);
        return spy.returnValue;
    }

    // Spy properties and methods
    spy.called = false;
    spy.callCount = 0;
    spy.returnValue = undefined;
    spy.calls = [];

    // Update spy's state after each call
    const originalSpy = spy;
    const spyWrapper = function() {
        const result = originalSpy.apply(this, arguments);
        spyWrapper.called = wasCalled;
        spyWrapper.callCount = callCount;
        spyWrapper.calls = calls;
        return result;
    };

    // Add methods
    spyWrapper.getCall = function(idx) {
        return calls[idx] || null;
    };

    spyWrapper.calledBefore = function(otherSpy) {
        if (!spyWrapper.called || !otherSpy.called) {
            return false;
        }
        return spyWrapper.getCall(0).callId < otherSpy.getCall(0).callId;
    };

    spyWrapper.calledImmediatelyBefore = function(otherSpy) {
        if (!spyWrapper.called || !otherSpy.called) {
            return false;
        }
        return (otherSpy.getCall(0).callId - spyWrapper.getCall(0).callId) === 1;
    };

    // Copy properties
    spyWrapper.called = spy.called;
    spyWrapper.callCount = spy.callCount;
    spyWrapper.returnValue = spy.returnValue;
    spyWrapper.calls = spy.calls;

    return spyWrapper;
}

module.exports = {
    spy: createSpy
};