import { strictEqual, ok } from "assert";
import { knuthShuffle } from "./knuth-shuffle";
import { spy, Spy } from "./spy";
import { orderByFirstCall } from "./order-by-first-call";

describe("orderByFirstCall", () => {
    it("should order an Array of spies by the callId of the first call, ascending", () => {
        // create an array of spies
        const spies: Spy[] = [
            spy(),
            spy(),
            spy(),
            spy(),
            spy(),
            spy(),
        ];

        // Call each spy so they have different callIds
        for (let i = 0; i < spies.length; i++) {
            spies[i]();
        }

        // add a few uncalled spies
        spies.push(spy());
        spies.push(spy());

        // Store the original order for later verification
        const originalOrder = spies.map((spy) => {
            return spy.called ? spy.getCall(0)!.callId : -1;
        });

        // randomise the order of the spies (use fixed seed for reproducibility)
        let shuffledSpies = knuthShuffle(spies, 42);

        // Ensure the array is actually shuffled
        const isSameOrder = spies.every((spy, index) => {
            return spies[index] === shuffledSpies[index];
        });
        // If shuffling didn't change anything, shuffle again with a different seed
        if (isSameOrder) {
            shuffledSpies = knuthShuffle(spies, 13);
        }

        // Now sort them using our function
        const sortedSpies = orderByFirstCall(shuffledSpies);

        // Verify length is maintained
        strictEqual(sortedSpies.length, spies.length);

        // Uncalled spies should be first in any order
        const uncalledSpies = sortedSpies.filter((spy) => !spy.called);
        for (let j = 0; j < uncalledSpies.length; j++) {
            strictEqual(sortedSpies[j].called, false);
        }

        // Called spies should come after uncalled spies
        const calledSpies = sortedSpies.filter((spy) => spy.called);
        const firstCalledSpyIndex = sortedSpies.findIndex((spy) => spy.called);
        
        // Verify called spies are in ascending order by callId
        for (let k = 0; k < calledSpies.length - 1; k++) {
            const current = calledSpies[k];
            const next = calledSpies[k + 1];
            const currentId = current.getCall(0)!.callId;
            const nextId = next.getCall(0)!.callId;
            
            ok(
                currentId < nextId, 
                `Spy with callId ${currentId} should come before spy with callId ${nextId}`
            );
        }
    });
    
    // Adding a new test to improve coverage
    it("should handle empty arrays", () => {
        const result = orderByFirstCall([]);
        strictEqual(result.length, 0);
    });
});