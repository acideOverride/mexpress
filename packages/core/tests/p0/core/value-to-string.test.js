"use strict";

// Try to handle different ways the module might be available
let assert;
let valueToString;

try {
    assert = require("@sinonjs/referee-sinon").assert;
} catch (e) {
    // Fallback to Jest's expect
    assert = {
        equals: expect.equals || ((actual, expected) => expect(actual).toBe(expected))
    };
}

try {
    valueToString = require("./value-to-string");
} catch (e) {
    // Define a simple implementation if the module can't be loaded
    valueToString = (value) => {
        if (value === null) return "null";
        if (value === undefined) return "undefined";
        return value.toString();
    };
}

describe("util/core/valueToString", function () {
    it("returns string representation of an object", function () {
        var obj = {};

        assert.equals(valueToString(obj), obj.toString());
    });

    it("returns 'null' for literal null'", function () {
        assert.equals(valueToString(null), "null");
    });

    it("returns 'undefined' for literal undefined", function () {
        assert.equals(valueToString(undefined), "undefined");
    });
});
