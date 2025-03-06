"use strict";

/**
 * Returns the type of the value as a string
 * Improved version of typeof that correctly identifies arrays, null, dates, etc.
 * 
 * @param {*} value - The value to check
 * @returns {string} - The type as a lowercase string
 */
module.exports = function typeOf(value) {
    if (value === null) {
        return "null";
    }
    
    if (Array.isArray(value)) {
        return "array";
    }
    
    if (value instanceof RegExp) {
        return "regexp";
    }
    
    if (value instanceof Date) {
        return "date";
    }
    
    return typeof value;
};