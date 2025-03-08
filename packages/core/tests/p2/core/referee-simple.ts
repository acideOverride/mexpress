/**
 * Simple mock implementation of referee assert for testing purposes
 */
export interface Assert {
  equals: (actual: any, expected: any) => boolean;
}

export const assert: Assert = {
  equals: function(actual: any, expected: any): boolean {
    if (actual !== expected) {
      throw new Error(`Expected ${expected} but got ${actual}`);
    }
    return true;
  }
};