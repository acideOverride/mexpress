/**
 * Returns the type of the value as a string
 * Improved version of typeof that correctly identifies arrays, null, dates, etc.
 * 
 * @param value - The value to check
 * @returns The type as a lowercase string
 */
export function typeOf(value: unknown): string {
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
}