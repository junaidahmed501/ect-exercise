function isValidDate(x) {
  return x instanceof Date && !Number.isNaN(x.getTime());
}

function checkPrimitiveEquivalency(a, b) {
  // assumptions for the purpose of this exercise (handled in main function):
  // - "undefined" and "null" are not treated as equal here
  // - it is assumed that both a and b are of the same type
  // - only primitive types are handled here
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true; // NaN ≈ NaN
    if (a === 0 && b === 0) return true;                 // -0 ≈ 0
  }
  return a === b;
}

/**
 * a function which checks if two objects are equivalent
 * - “undefined” and “null” can be treated as equal
 * - consider all primitive types, objects, arrays and dates
 *
 * @param a - The first object to compare
 * @param b - The second object to compare
 * @returns {boolean} - True if the objects are equivalent, false otherwise
 */
function check(a, b) {
  // Special rule: null == undefined
  if ((a === undefined && b === null) || (a == null && b === undefined)) return true;

  // handle case of 'object of value null vs non-null' as null is also 'object'
  if ((a === null || b === null) && (a !== b)) return false;

  // Type mismatch (after handling null vs non-null)
  if (typeof a !== typeof b) return false;

  // Primitives
  if (typeof a !== 'object') {
    return checkPrimitiveEquivalency(a, b);
  }

  // Date by value
  if (a instanceof Date && b instanceof Date) {
    return isValidDate(a) && isValidDate(b) && a.getTime() === b.getTime();
  }

  // Exception: array vs plain object should not be considered equal
  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr !== bIsArr) return false;
  // Arrays (order matters)
  if (aIsArr) {
    // one check is enough as typeof is already checked above
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!check(a[i], b[i])) return false;
    }
    return true;
  }

  // ignore everything else of special types (like Map, Set, Function, etc.) and check simple equality
  if (Object.prototype.toString.call(a) !== '[object Object]' ||
      Object.prototype.toString.call(b) !== '[object Object]') {
    return a === b;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length < bKeys.length) {
    for (const k of aKeys) {
      if (!b.hasOwnProperty(k)) return false;
      if (!check(a[k], b[k])) return false;
    }
    return true;
  } else {
    for (const k of bKeys) {
      if (!a.hasOwnProperty(k)) return false;
      if (!check(b[k], a[k])) return false;
    }
    return true;
  }
}

// UMD pattern - works in both Node.js and browser
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js
    module.exports = factory();
  } else {
    // Browser globals
    root.check = factory().check;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return { check: check };
}));
