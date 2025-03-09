/**
 * Safely copies the methods from a prototype into a new object
 * 
 * @param prototype The prototype object to copy methods from
 * @returns An object containing the copied methods
 */
export function copyPrototypeMethods(prototype: object | null | undefined): Record<string, Function> {
  const result: Record<string, Function> = {};
  
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
        if (descriptor && typeof descriptor.value === "function") {
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