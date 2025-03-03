"use strict";

/**
 * Safely copies the methods from a prototype into a new object
 * 
 * @param {Object} prototype The prototype object to copy methods from
 * @returns {Object} An object containing the copied methods
 */
function copyPrototypeMethods(prototype) {
  const result = {};
  
  // Handle null or undefined inputs
  if (!prototype) {
    return result;
  }

  try {
    // Get all own property names, including non-enumerable ones
    const properties = Object.getOwnPropertyNames(prototype);
    
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      
      try {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
        
        // Only copy if it's a method (function)
        if (typeof descriptor.value === "function") {
          result[property] = descriptor.value;
        }
      } catch (e) {
        // Skip properties that can't be accessed
        continue;
      }
    }
  } catch (e) {
    // Return empty object if prototype can't be processed
  }
  
  return result;
}

module.exports = copyPrototypeMethods;