"use strict";

/**
 * Determines if the provided spy/stub objects were called in the specified order
 *
 * @param {Array<sinon.spy>|...sinon.spy} spies
 * @returns {boolean}
 */
function calledInOrder(spies) {
  // Convert arguments to array if multiple arguments provided
  if (arguments.length > 1) {
    spies = Array.prototype.slice.call(arguments);
  }

  // Check if we have at least two spies to compare
  if (!Array.isArray(spies) || spies.length < 2) {
    return true;
  }

  // Loop through adjacent pairs of spies
  for (let i = 0; i < spies.length - 1; i++) {
    const first = spies[i];
    const second = spies[i + 1];
    
    // If any spy wasn't called or wasn't called before the next spy, return false
    if (!first.called || !second.called || !first.calledBefore(second)) {
      return false;
    }
  }

  return true;
}

module.exports = calledInOrder;