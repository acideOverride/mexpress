"use strict";

/**
 * Simple mock implementation of referee assert for testing purposes
 */
const assert = {
  equals: function(actual, expected) {
    if (actual !== expected) {
      throw new Error(`Expected ${expected} but got ${actual}`);
    }
    return true;
  }
};

module.exports = {
  assert: assert
};