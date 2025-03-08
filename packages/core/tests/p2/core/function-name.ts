/**
 * Returns the name of a function
 * 
 * @param {Function|Object} func The function to get the name from
 * @returns {string} The name of the function or an empty string
 */
export function functionName(func: any): string {
  if (!func) {
    return "";
  }

  // Use displayName if available
  if (func.displayName) {
    return func.displayName;
  }

  // Use name if available
  if (func.name) {
    return func.name;
  }

  // Fall back to string parsing
  try {
    if (typeof func.toString === "function") {
      const functionString = func.toString();
      const match = /\bfunction\s+([^\s(]+)/i.exec(functionString);
      
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (e) {
    // Ignore any errors from toString
  }

  return "";
}