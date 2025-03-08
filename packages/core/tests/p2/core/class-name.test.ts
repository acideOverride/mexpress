import { assert } from "./referee-simple";
import { className } from "./class-name";

describe("className", () => {
  it("returns the class name of an instance", () => {
    // With TypeScript we can now properly use ES6 classes
    class TestClass {}
    const instance = new TestClass();
    const name = className(instance);
    assert.equals(name, "TestClass");
  });

  it("returns 'Object' for {}", () => {
    const name = className({});
    assert.equals(name, "Object");
  });

  it("returns null for an object that has no prototype", () => {
    const obj = Object.create(null);
    const name = className(obj);
    assert.equals(name, null);
  });

  it("returns null for an object whose prototype was mangled", () => {
    // This simulates what Node v6 and v7 do for objects returned by querystring.parse()
    function MangledObject() {}
    // Need to use any to allow prototype mutation
    (MangledObject as any).prototype = Object.create(null);
    const obj = new (MangledObject as any)();
    const name = className(obj);
    assert.equals(name, null);
  });

  // Add a new TypeScript-specific test for interfaces
  it("handles class instances that implement interfaces", () => {
    // Define an interface
    interface TestInterface {
      value: string;
    }
    
    // Create a class that implements the interface
    class ImplementingClass implements TestInterface {
      value = "test";
    }
    
    const instance = new ImplementingClass();
    const name = className(instance);
    assert.equals(name, "ImplementingClass");
  });
});