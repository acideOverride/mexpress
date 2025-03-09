import { strictEqual } from "assert";
import { typeOf } from "./type-of";

describe("typeOf", () => {
    it("returns boolean", () => {
        strictEqual(typeOf(false), "boolean");
    });

    it("returns string", () => {
        strictEqual(typeOf("Sinon.JS"), "string");
    });

    it("returns number", () => {
        strictEqual(typeOf(123), "number");
    });

    it("returns object", () => {
        strictEqual(typeOf({}), "object");
    });

    it("returns function", () => {
        strictEqual(
            typeOf(function () {
                return undefined;
            }),
            "function"
        );
    });

    it("returns undefined", () => {
        strictEqual(typeOf(undefined), "undefined");
    });

    it("returns null", () => {
        strictEqual(typeOf(null), "null");
    });

    it("returns array", () => {
        strictEqual(typeOf([]), "array");
    });

    it("returns regexp", () => {
        strictEqual(typeOf(/.*/), "regexp");
    });

    it("returns date", () => {
        strictEqual(typeOf(new Date()), "date");
    });
    
    // Additional TypeScript-specific test cases
    it("handles symbol type", () => {
        strictEqual(typeOf(Symbol("test")), "symbol");
    });
    
    it("handles bigint type", () => {
        strictEqual(typeOf(BigInt(9007199254740991)), "bigint");
    });
    
    it("correctly identifies object types even with complex inheritance", () => {
        class TestClass {}
        class ChildClass extends TestClass {}
        
        strictEqual(typeOf(new TestClass()), "object");
        strictEqual(typeOf(new ChildClass()), "object");
    });
});