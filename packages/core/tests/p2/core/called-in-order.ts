/**
 * Utility function to determine if spies/stubs were called in a specific order.
 * 
 * TypeScript implementation of a Sinon-like calledInOrder utility
 */

/**
 * Interface for a spy/stub object with Sinon-like properties
 */
export interface Spy {
  called: boolean;
  getCall(index: number): SpyCall | null;
}

/**
 * Interface for a spy call object
 */
export interface SpyCall {
  callId: number;
}

/**
 * Determines if the provided spy/stub objects were called in the specified order
 *
 * @param spies - Array of spy objects or individual spy arguments
 * @returns true if spies were called in order, false otherwise
 */
function calledInOrder(...args: Spy[] | [Spy[]]): boolean {
  // Convert arguments to array if passed as an array
  let spies: Spy[];
  
  if (args.length === 1 && Array.isArray(args[0])) {
    spies = args[0];
  } else {
    spies = args as Spy[];
  }
  
  // Empty or single spy always returns true
  if (!spies || !spies.length || spies.length < 2) {
    return true;
  }
  
  // Check each consecutive pair of spies
  for (let i = 0; i < spies.length - 1; i++) {
    const first = spies[i];
    const second = spies[i + 1];
    
    // If any spy wasn't called, return false
    if (!first.called || !second.called) {
      return false;
    }
    
    // Get the first call for each spy
    const firstCall = first.getCall(0);
    const secondCall = second.getCall(0);
    
    // If any call can't be retrieved, or if the first call doesn't happen before the second,
    // return false
    if (!firstCall || !secondCall || firstCall.callId >= secondCall.callId) {
      return false;
    }
  }
  
  return true;
}

// Export as both default and named export for flexibility
export { calledInOrder };
export default calledInOrder;