"use strict";

var refute = require("./referee-mock").refute;
var copyPrototypeMethods = require("./copy-prototype-methods");

describe("copyPrototypeMethods", function () {
    it("does not throw for Map", function () {
        refute.exception(function () {
            copyPrototypeMethods(Map.prototype);
        });
    });
});
