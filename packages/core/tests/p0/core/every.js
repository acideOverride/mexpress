"use strict";

/**
 * Returns true if the callback returns true for every element in the iterable
 * Short-circuits on first false return
 * @param {Array} iterable - The array to iterate over
 * @param {Function} callback - Function to call for each element
 * @returns {boolean} - True if all elements pass the callback test
 */
function every(iterable, callback) {
    for (var i = 0; i < iterable.length; i++) {
        if (!callback(iterable[i])) {
            return false;
        }
    }
    return true;
}

module.exports = every;