import { assert } from '@sinonjs/referee-sinon';
import valueToString from './value-to-string';

describe("util/core/valueToString", () => {
  it("returns string representation of an object", () => {
    const obj = {};
    assert.equals(valueToString(obj), obj.toString());
  });

  it("returns 'null' for literal null'", () => {
    assert.equals(valueToString(null), "null");
  });

  it("returns 'undefined' for literal undefined", () => {
    assert.equals(valueToString(undefined), "undefined");
  });

  it("returns correct string for various data types", () => {
    // Numbers
    assert.equals(valueToString(42), "42");
    assert.equals(valueToString(0), "0");
    assert.equals(valueToString(-42), "-42");
    assert.equals(valueToString(3.14159), "3.14159");
    
    // Strings
    assert.equals(valueToString("hello"), "hello");
    assert.equals(valueToString(""), "");
    
    // Booleans
    assert.equals(valueToString(true), "true");
    assert.equals(valueToString(false), "false");
    
    // Arrays
    assert.equals(valueToString([1, 2, 3]), "1,2,3");
    assert.equals(valueToString([]), "");
    
    // Dates
    const date = new Date(2025, 0, 1);
    assert.equals(valueToString(date), date.toString());
  });
});