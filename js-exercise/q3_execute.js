/**
 * Executes a string provided javascript code
 *
 * @param {string} code - JavaScript code to run (e.g. '$logger("Sum:", $math.sum(a,b))')
 * @param {Object<string, any>} [variables] - Variables to expose to the code ({ a: 17, b: 3 })
 * @returns void
 */
function execute(code, variables = {}) {
  // required global methods
  const $math = Object.freeze({
    sum: (x, y) => x + y,
    mul: (x, y) => x * y,
  });
  const $logger = console.log.bind(console); // attach console context

  const filteredVariables = { ...variables };
  delete filteredVariables.$math;
  delete filteredVariables.$logger;

  const paramNames = ['$math', '$logger', ...Object.keys(filteredVariables)];
  const paramValues = [$math, $logger, ...Object.values(filteredVariables)];
  const wrappedCode = `'use strict'; ${code} //# sourceURL=executed-snippet.js`;

  const fn = new Function(...paramNames, wrappedCode);
  fn(...paramValues);
}

/**
 * Deliberately exposing only the 'execute' function to match the exercise style.
 * Could write more tests but time is money my friends :P
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.execute = factory().execute;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return { execute };
}));
