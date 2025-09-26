/**
 * Executes a string of JavaScript code with injected variables and globals.
 *
 * @param {string} code - JavaScript code to run (e.g. '$logger("Sum:", $math.sum(a,b))')
 * @param {Object<string, any>} [variables] - Variables to expose to the code ({ a: 17, b: 3 })
 * @returns void
 */
function execute(code, variables = {}) {
  const $math = Object.freeze({
    sum: (x, y) => x + y,
    mul: (x, y) => x * y,
  });
  const $logger = console.log.bind(console); // attach console context

  // filter out any user variables that would mess with the required global methods i.e. $math, $logger
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
