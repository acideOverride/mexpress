import { assert, sinon } from '@sinonjs/referee-sinon';
import every from './every';

describe("util/core/every", () => {
  it("returns true when the callback function returns true for every element in an iterable", () => {
    const obj = [true, true, true, true];
    const allTrue = every(obj, (val) => {
      return val;
    });

    assert(allTrue);
  });

  it("returns false when the callback function returns false for any element in an iterable", () => {
    const obj = [true, true, true, false];
    const result = every(obj, (val) => {
      return val;
    });

    assert.isFalse(result);
  });

  it("calls the given callback once for each item in an iterable until it returns false", () => {
    const iterableOne = [true, true, true, true];
    const iterableTwo = [true, true, false, true];
    const callback = sinon.spy((val: boolean) => {
      return val;
    });

    every(iterableOne, callback);
    assert.equals(callback.callCount, 4);

    callback.resetHistory();

    every(iterableTwo, callback);
    assert.equals(callback.callCount, 3);
  });

  it("handles arrays of various data types", () => {
    // Test with numbers
    const numbers = [1, 2, 3, 4];
    const allPositive = every(numbers, (num) => num > 0);
    assert(allPositive);

    // Test with strings
    const strings = ["a", "b", "c"];
    const allLetters = every(strings, (str) => /^[a-z]$/.test(str));
    assert(allLetters);

    // Test with objects
    const objects = [{ valid: true }, { valid: true }, { valid: true }];
    const allValid = every(objects, (obj) => obj.valid);
    assert(allValid);
  });
});