// Shared counter across all spies to simulate unique callIds
let globalCounter = 0;

/**
 * Represents a spy call
 */
export interface SpyCall {
    callId: number;
    args: any[];
}

/**
 * Interface for a test spy
 */
export interface Spy {
    (...args: any[]): any;
    called: boolean;
    callCount: number;
    returnValue: any;
    calls: SpyCall[];
    getCall(idx: number): SpyCall | null;
    calledBefore(otherSpy: Spy): boolean;
    calledImmediatelyBefore(otherSpy: Spy): boolean;
}

/**
 * A very simple spy implementation for testing
 * This is a much simplified version of the Sinon spy
 */
function createSpy(): Spy {
    let callCount = 0;
    const calls: SpyCall[] = [];
    let wasCalled = false;

    function spy(...args: any[]): any {
        wasCalled = true;
        const call: SpyCall = {
            callId: globalCounter++, // Use global counter for unique callIds
            args: args
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
    const spyWrapper = function(this: any, ...args: any[]): any {
        const result = originalSpy.apply(this, args);
        spyWrapper.called = wasCalled;
        spyWrapper.callCount = callCount;
        spyWrapper.calls = calls;
        return result;
    } as Spy;

    // Add methods
    spyWrapper.getCall = function(idx: number): SpyCall | null {
        return calls[idx] || null;
    };

    spyWrapper.calledBefore = function(otherSpy: Spy): boolean {
        if (!spyWrapper.called || !otherSpy.called) {
            return false;
        }
        return (spyWrapper.getCall(0)?.callId || 0) < (otherSpy.getCall(0)?.callId || 0);
    };

    spyWrapper.calledImmediatelyBefore = function(otherSpy: Spy): boolean {
        if (!spyWrapper.called || !otherSpy.called) {
            return false;
        }
        return ((otherSpy.getCall(0)?.callId || 0) - (spyWrapper.getCall(0)?.callId || 0)) === 1;
    };

    // Copy properties
    spyWrapper.called = spy.called;
    spyWrapper.callCount = spy.callCount;
    spyWrapper.returnValue = spy.returnValue;
    spyWrapper.calls = spy.calls;

    return spyWrapper;
}

export const spy = createSpy;