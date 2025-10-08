/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  if (!arr || arr.length === 0 || !Array.isArray(arr)) {
    return [];
  }

  const newObj = new Set();

  for (let i = 0; i < arr.length; i++) {
    newObj.add(arr[i]);
  }

  return Array.from(newObj);
}
