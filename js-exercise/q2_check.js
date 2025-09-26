/**
 * Returns true if the input is a valid Date object
 * @param {*} date - The date to check
 * @returns {boolean} - True if valid Date object, false otherwise
 */
function isValidDate(date) {
  return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}
/**
 * Checks if two primitive values are equivalent
 * PS: If the function name isn't self-explanatory, I don't know what will be.
 *
 * Assumptions for the purpose of this exercise (handled in main function):
 *  - "undefined" and "null" are not treated as equal here
 *  - it is assumed that both a and b are of the same type
 *  - only primitive types are handled here
 *
 * @param a - first primitive value
 * @param b - second primitive value
 * @returns {boolean} - true if equivalent, false otherwise
 */
function checkPrimitiveEquivalency(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (a === 0 && b === 0) return true;
  }
  return a === b;
}

/**
 * a function which checks if two objects are equivalent
 * - "undefined" and "null" can be treated as equal
 * - consider all primitive types, objects, arrays and dates
 *
 * @param a - The first object to compare
 * @param b - The second object to compare
 * @returns {boolean} - True if the objects are equivalent, false otherwise
 */
function check(a, b) {
  // Special rule: null == undefined
  if ((a === undefined && b === null) || (a == null && b === undefined)) return true;

  // handle case where one is null/undefined and the other isn't
  if ((a === null || b === null) && (a !== b)) return false;

  // handle Type mismatch, this will also help down the line to avoid unnecessary checks
  if (typeof a !== typeof b) return false;

  // handle Primitives
  if (typeof a !== 'object') {
    return checkPrimitiveEquivalency(a, b);
  }

  // handle Dates
  if (a instanceof Date) {
    return isValidDate(a) && isValidDate(b) && a.getTime() === b.getTime();
  }

  // handle Arrays
  if (Array.isArray(a)) {
    // one check is enough as typeof is already checked above
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!check(a[i], b[i])) return false;
    }
    return true;
  }

  // ignore everything else
  if (Object.prototype.toString.call(a) !== '[object Object]' ||
      Object.prototype.toString.call(b) !== '[object Object]') {
    return a === b;
  }

  // handle the main (recursive) case for objects
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  const smallerKeys = aKeys.length <= bKeys.length ? aKeys : bKeys;
  const smallerObj = aKeys.length <= bKeys.length ? a : b;
  const largerObj = aKeys.length <= bKeys.length ? b : a;

  for (const key of smallerKeys) {
    if (!largerObj.hasOwnProperty(key) || !check(smallerObj[key], largerObj[key])) {
      return false;
    }
  }
  return true;
}

/**
 * Deliberately exposing only the 'check' function to contain the scope of the exercise sane :D
 * Want more tests? SHOW ME THE MONEY :P
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.check = factory().check;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return { check };
}));
