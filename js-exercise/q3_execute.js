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
  const $logger = console.log.bind(console); // keep console as `this`

  // Filter out any user variables that would shadow globals
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
 * Time is money my friends, want more tests? well, you know the drill :P
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
