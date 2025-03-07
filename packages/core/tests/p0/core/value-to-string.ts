/**
 * Returns the string representation of a value
 * 
 * @param value - The value to convert to string
 * @returns String representation of the value
 */
function valueToString(value: any): string {
  if (value === null) {
    return "null";
  }
  
  if (value === undefined) {
    return "undefined";
  }
  
  return value.toString();
}

export default valueToString;