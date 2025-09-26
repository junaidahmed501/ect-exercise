/**
 * Returns true if the input is a valid Date object
 * @param {*} date - The date to check
 * @returns {boolean} - True if valid Date object, false otherwise
 */
function isValidDate(date) {
  return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

/**
 * Performs a deep copy of the provided input, supporting the following data types:
 * - number
 * - string
 * - undefined
 * - Date
 * - object (null, array, plain object (obviously), Map)
 *
 * The function explicitly ignores cloning of functions, prototypes, and other special types.
 * Cyclic references are handled to avoid infinite loops.
 *
 * This implementation scope is based on the email clarification from the interviewers.
 *
 * @param obj - The input to deep copy.
 * @returns - A deep copy of the input.
 */
function deepCopy(obj) {
  const lookup = new WeakMap();

  function _deepCopy(obj) {
    // base case
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }

    // handles cyclic references
    if (lookup.has(obj)) {
      return lookup.get(obj);
    }

    // handle Date
    if (isValidDate(obj)) {
      const dateCopy = new Date(obj.getTime());
      lookup.set(obj, dateCopy);
      return dateCopy;
    }

    // handle Array
    if (Array.isArray(obj)) {
      let arrayCopy = [];
      lookup.set(obj, arrayCopy);
      for (let i = 0; i < obj.length; i++) {
        arrayCopy[i] = _deepCopy(obj[i]);
      }
      return arrayCopy;
    }

    // handle Map
    if (obj instanceof Map) {
      const mapCopy = new Map();
      lookup.set(obj, mapCopy);
      for (const [key, value] of obj) {
        mapCopy.set(_deepCopy(key), _deepCopy(value));
      }
      return mapCopy;
    }

    // ignore functions, prototypes, special types
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      return obj;
    }

    // handle plain object
    const objCopy = {};
    lookup.set(obj, objCopy);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = _deepCopy(obj[key]);
      }
    }
    return objCopy;
  }

  return _deepCopy(obj);
}

/**
 * Deliberately exposing only the 'deepCopy' function to contain the scope of the exercise sane :D
 * I would have written more tests if I was being paid for this :P
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exported = factory();
    root.deepCopy = exported.deepCopy;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return { deepCopy };
}));
