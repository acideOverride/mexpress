"use strict";

/**
 * Returns the class name of an object instance
 * 
 * @param {Object} object The object to get the class name from
 * @returns {string|null} The class name or null for objects with no prototype
 */
function className(object) {
  if (object === null || object === undefined) {
    return null;
  }

  const proto = Object.getPrototypeOf(object);
  
  // Handle objects with no prototype or mangled prototype
  if (!proto || !proto.constructor) {
    return null;
  }

  // Get the constructor name
  const constructorName = proto.constructor.name;
  
  return constructorName;
}

module.exports = className;