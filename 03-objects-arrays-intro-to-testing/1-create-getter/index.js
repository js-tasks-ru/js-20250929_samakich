/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arrFromPath = path.split('.');

  return function (obj) {

    for (const item of arrFromPath) {
      if (!Object.hasOwn(obj, item)) {
        return;
      }
      obj = obj[item];
    }

    return obj;
  };
}
