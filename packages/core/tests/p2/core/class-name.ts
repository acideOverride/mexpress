/**
 * Returns the class name of an object instance
 * 
 * @param object The object to get the class name from
 * @returns The class name or null for objects with no prototype
 */
export function className(object: unknown): string | null {
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