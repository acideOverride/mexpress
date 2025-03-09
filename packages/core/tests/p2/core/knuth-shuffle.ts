/**
 * Fisher-Yates (Knuth) shuffle algorithm
 * Randomizes the order of elements in an array in-place
 * 
 * @param array - The array to shuffle
 * @param seed - Optional seed for reproducible shuffling
 * @returns The shuffled array (same reference as input)
 */
export function knuthShuffle<T>(array: T[], seed?: number): T[] {
    // Make a copy to avoid modifying the original
    const result = array.slice();
    let currentIndex = result.length;
    let temporaryValue: T, randomIndex: number;

    // Simple random function with seed
    function random(): number {
        if (seed !== undefined) {
            // Simple PRNG with seed
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        }
        return Math.random();
    }

    // While there remain elements to shuffle
    while (currentIndex > 0) {
        // Pick a remaining element
        randomIndex = Math.floor(random() * currentIndex);
        currentIndex -= 1;

        // Swap it with the current element
        temporaryValue = result[currentIndex];
        result[currentIndex] = result[randomIndex];
        result[randomIndex] = temporaryValue;
    }

    return result;
}