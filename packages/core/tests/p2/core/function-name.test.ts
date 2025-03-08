import jsc from "./jsverify-mock";
import { refute } from "./referee-mock";
import { functionName } from "./function-name";

describe("function-name", () => {
  it("should return empty string if func is falsy", () => {
    expect(jsc.assertForall("falsy", (fn: any) => {
      return functionName(fn) === "";
    })).toBe(true);
  });

  it("should use displayName by default", () => {
    expect(jsc.assertForall("nestring", (displayName: string) => {
      const fn = { displayName };
      return functionName(fn) === fn.displayName;
    })).toBe(true);
  });

  it("should use name if displayName is not available", () => {
    expect(jsc.assertForall("nestring", (name: string) => {
      const fn = { name };
      return functionName(fn) === fn.name;
    })).toBe(true);
  });

  it("should fallback to string parsing", () => {
    expect(jsc.assertForall("nat", (naturalNumber: number) => {
      const name = `fn${naturalNumber}`;
      const fn = {
        toString: function () {
          return `\nfunction ${name}`;
        },
      };
      return functionName(fn) === name;
    })).toBe(true);
  });

  it("should not fail when a name cannot be found", () => {
    const result = refute.exception(() => {
      const fn = {
        toString: function () {
          return "\nfunction (";
        },
      };
      functionName(fn);
    });
    expect(result).toBe(true);
  });

  it("should not fail when toString is undefined", () => {
    const result = refute.exception(() => {
      functionName(Object.create(null));
    });
    expect(result).toBe(true);
  });

  it("should not fail when toString throws", () => {
    const result = refute.exception(() => {
      let fn;
      try {
        // Using Function constructor instead of eval for better TypeScript compatibility
        fn = new Function("return (function*() {})().constructor")();
      } catch (e) {
        // env doesn't support generators
        return;
      }
      functionName(fn);
    });
    expect(result).toBe(true);
  });
});