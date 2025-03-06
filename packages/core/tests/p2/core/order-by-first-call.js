"use strict";

/**
 * Sorts an array of spy/stub objects by their first call
 * 
 * @param {Object[]} spies - Array of Sinon spy/stub objects
 * @returns {Object[]} - Sorted array of spies
 */
function orderByFirstCall(spies) {
    // Make a copy of the array to avoid modifying the original
    var spiesCopy = spies.slice();
    
    // Sort the spies by their callId
    return spiesCopy.sort(function(a, b) {
        // Get the first call for each spy
        var aCall = a.called ? a.getCall(0) : null;
        var bCall = b.called ? b.getCall(0) : null;
        
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
        var aId = aCall.callId || -1;
        var bId = bCall.callId || -1;
        
        return aId < bId ? -1 : 1;
    });
}

module.exports = orderByFirstCall;