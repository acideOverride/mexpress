/**
 * Returns true if the callback returns true for every element in the iterable
 * Short-circuits on first false return
 * @param iterable - The array to iterate over
 * @param callback - Function to call for each element
 * @returns True if all elements pass the callback test
 */
function every<T>(iterable: T[], callback: (value: T) => boolean): boolean {
  for (let i = 0; i < iterable.length; i++) {
    if (!callback(iterable[i])) {
      return false;
    }
  }
  return true;
}

export default every;