"use strict";

var assert = require("assert");
var knuthShuffle = require("./knuth-shuffle");
var sinon = require("./spy");
var orderByFirstCall = require("./order-by-first-call");

describe("orderByFirstCall", function () {
    it("should order an Array of spies by the callId of the first call, ascending", function () {
        // create an array of spies
        var spies = [
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
        ];

        // Call each spy so they have different callIds
        for (var i = 0; i < spies.length; i++) {
            spies[i]();
        }

        // add a few uncalled spies
        spies.push(sinon.spy());
        spies.push(sinon.spy());

        // Store the original order for later verification
        var originalOrder = spies.map(function(spy) {
            return spy.called ? spy.getCall(0).callId : -1;
        });

        // randomise the order of the spies (use fixed seed for reproducibility)
        var shuffledSpies = knuthShuffle(spies, 42);

        // Ensure the array is actually shuffled
        var isSameOrder = spies.every(function(spy, index) {
            return spies[index] === shuffledSpies[index];
        });
        // If shuffling didn't change anything, shuffle again with a different seed
        if (isSameOrder) {
            shuffledSpies = knuthShuffle(spies, 13);
        }

        // Now sort them using our function
        var sortedSpies = orderByFirstCall(shuffledSpies);

        // Verify length is maintained
        assert.strictEqual(sortedSpies.length, spies.length);

        // Uncalled spies should be first in any order
        var uncalledSpies = sortedSpies.filter(function(spy) { return !spy.called; });
        for (var j = 0; j < uncalledSpies.length; j++) {
            assert.strictEqual(sortedSpies[j].called, false);
        }

        // Called spies should come after uncalled spies
        var calledSpies = sortedSpies.filter(function(spy) { return spy.called; });
        var firstCalledSpyIndex = sortedSpies.findIndex(function(spy) { return spy.called; });
        
        // Verify called spies are in ascending order by callId
        for (var k = 0; k < calledSpies.length - 1; k++) {
            var current = calledSpies[k];
            var next = calledSpies[k + 1];
            var currentId = current.getCall(0).callId;
            var nextId = next.getCall(0).callId;
            
            assert.ok(
                currentId < nextId, 
                `Spy with callId ${currentId} should come before spy with callId ${nextId}`
            );
        }
    });
});