"use strict";

var assert = require("assert");
var typeOf = require("./type-of");

describe("typeOf", function () {
    it("returns boolean", function () {
        assert.strictEqual(typeOf(false), "boolean");
    });

    it("returns string", function () {
        assert.strictEqual(typeOf("Sinon.JS"), "string");
    });

    it("returns number", function () {
        assert.strictEqual(typeOf(123), "number");
    });

    it("returns object", function () {
        assert.strictEqual(typeOf({}), "object");
    });

    it("returns function", function () {
        assert.strictEqual(
            typeOf(function () {
                return undefined;
            }),
            "function"
        );
    });

    it("returns undefined", function () {
        assert.strictEqual(typeOf(undefined), "undefined");
    });

    it("returns null", function () {
        assert.strictEqual(typeOf(null), "null");
    });

    it("returns array", function () {
        assert.strictEqual(typeOf([]), "array");
    });

    it("returns regexp", function () {
        assert.strictEqual(typeOf(/.*/), "regexp");
    });

    it("returns date", function () {
        assert.strictEqual(typeOf(new Date()), "date");
    });
});