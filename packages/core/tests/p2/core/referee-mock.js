"use strict";

/**
 * Simple mock for referee's refute functionality
 */
const refute = {
  exception: function(fn) {
    try {
      fn();
      // If no exception, test passes
      return true;
    } catch (e) {
      // If exception, test fails
      throw new Error("Expected no exception, but got: " + e.message);
    }
  }
};

module.exports = {
  refute: refute,
  sinon: {} // Empty sinon object since we don't need it
};