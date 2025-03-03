"use strict";

/**
 * Returns the string representation of a value
 * 
 * @param {*} value - The value to convert to string
 * @returns {string} - String representation of the value
 */
function valueToString(value) {
    if (value === null) {
        return "null";
    }
    
    if (value === undefined) {
        return "undefined";
    }
    
    return value.toString();
}

module.exports = valueToString;