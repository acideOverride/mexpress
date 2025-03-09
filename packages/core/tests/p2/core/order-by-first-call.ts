import { Spy } from "./spy";

/**
 * Sorts an array of spy/stub objects by their first call
 * 
 * @param spies - Array of Sinon spy/stub objects
 * @returns Sorted array of spies
 */
export function orderByFirstCall(spies: Spy[]): Spy[] {
    // Make a copy of the array to avoid modifying the original
    const spiesCopy = spies.slice();
    
    // Sort the spies by their callId
    return spiesCopy.sort((a, b) => {
        // Get the first call for each spy
        const aCall = a.called ? a.getCall(0) : null;
        const bCall = b.called ? b.getCall(0) : null;
        
        // If neither spy was called, maintain original order
        if (!aCall && !bCall) {
            return 0;
        }
        
        // Uncalled spies should come before called spies
        if (!aCall) {
            return -1;
        }
        
        if (!bCall) {
            return 1;
        }
        
        // Sort by callId (increasing order)
        const aId = aCall.callId ?? -1;
        const bId = bCall.callId ?? -1;
        
        return aId < bId ? -1 : 1;
    });
}