import { refute } from "./referee-mock";
import { copyPrototypeMethods } from "./copy-prototype-methods";

describe("copyPrototypeMethods", () => {
  it("does not throw for Map", () => {
    refute.exception(() => {
      copyPrototypeMethods(Map.prototype);
    });
  });

  it("does not throw for Set", () => {
    refute.exception(() => {
      copyPrototypeMethods(Set.prototype);
    });
  });

  it("returns empty object for null or undefined", () => {
    const nullResult = copyPrototypeMethods(null);
    const undefinedResult = copyPrototypeMethods(undefined);
    
    expect(Object.keys(nullResult).length).toBe(0);
    expect(Object.keys(undefinedResult).length).toBe(0);
  });

  it("properly copies functions from prototype", () => {
    // Define a class with prototype methods
    class TestClass {
      constructor(public value: number) {}
      
      getValue(): number {
        return this.value;
      }
      
      setValue(newValue: number): void {
        this.value = newValue;
      }
      
      // Non-enumerable property
      static get [Symbol.species]() {
        return TestClass;
      }
    }
    
    // Add a non-function property to the prototype
    Object.defineProperty(TestClass.prototype, 'nonFunctionProp', {
      value: 'test',
      enumerable: true
    });
    
    const result = copyPrototypeMethods(TestClass.prototype);
    
    // Should have getValue and setValue methods
    expect(typeof result.getValue).toBe('function');
    expect(typeof result.setValue).toBe('function');
    
    // Should not include non-function properties
    expect(result.nonFunctionProp).toBeUndefined();
  });
});