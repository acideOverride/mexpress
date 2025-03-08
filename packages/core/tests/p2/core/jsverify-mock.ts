/**
 * Very simple mock of jsverify for testing purposes only
 */
type PropertyType = "falsy" | "nestring" | "nat";
type PropertyFunction<T> = (value: T) => boolean;

class JSC {
  // Simple assertForall implementation that just runs the property function with various values
  assertForall<T>(type: PropertyType, propertyFn: PropertyFunction<any>): boolean {
    switch (type) {
      case "falsy":
        // Test with common falsy values
        return propertyFn(null) && propertyFn(undefined) && propertyFn(false) && propertyFn(0) && propertyFn("");
      
      case "nestring":
        // Test with a few non-empty strings
        return propertyFn("test") && propertyFn("function") && propertyFn("displayName");
      
      case "nat":
        // Test with a few natural numbers
        return propertyFn(0) && propertyFn(1) && propertyFn(42) && propertyFn(100);
      
      default:
        throw new Error("Unknown type: " + type);
    }
  }
}

const jsc = new JSC();
export default jsc;