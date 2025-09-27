const { execute } = require('./q3_execute');

describe('execute (Q3)', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('shall execute the prompt examples', () => {
    execute('$logger("Sum:", $math.sum(a, b))', { a: 17, b: 3 });
    expect(consoleSpy).toHaveBeenCalledWith('Sum:', 20);

    execute('$logger("Mul:", $math.mul(a, b))', { a: 17, b: 3 });
    expect(consoleSpy).toHaveBeenCalledWith('Mul:', 51);
  });

  it('shall execute code with $math.sum function', () => {
    execute('$logger($math.sum(5, 10))');
    expect(consoleSpy).toHaveBeenCalledWith(15);

    execute('$logger($math.sum(-5, 3))');
    expect(consoleSpy).toHaveBeenCalledWith(-2);

    execute('$logger($math.sum(0.1, 0.2))');
    expect(consoleSpy).toHaveBeenCalledWith(0.30000000000000004); // floating point precision
  });

  it('shall execute code with $math.mul function', () => {
    execute('$logger($math.mul(6, 7))');
    expect(consoleSpy).toHaveBeenCalledWith(42);

    execute('$logger($math.mul(-3, 4))');
    expect(consoleSpy).toHaveBeenCalledWith(-12);

    execute('$logger($math.mul(0, 100))');
    expect(consoleSpy).toHaveBeenCalledWith(0);
  });

  it('shall execute code with variables', () => {
    execute('$logger(name, age)', { name: 'Alice', age: 25 });
    expect(consoleSpy).toHaveBeenCalledWith('Alice', 25);

    execute('$logger(x + y)', { x: 10, y: 20 });
    expect(consoleSpy).toHaveBeenCalledWith(30);
  });

  it('shall execute code without variables', () => {
    execute('$logger("Hello World")');
    expect(consoleSpy).toHaveBeenCalledWith('Hello World');

    execute('$logger($math.sum(1, 2))');
    expect(consoleSpy).toHaveBeenCalledWith(3);
  });

  it('shall handle complex expressions', () => {
    execute('$logger($math.sum($math.mul(a, b), c))', { a: 3, b: 4, c: 5 });
    expect(consoleSpy).toHaveBeenCalledWith(17); // (3*4) + 5 = 17

    execute('const result = $math.sum(x, y); $logger("Result:", result)', { x: 8, y: 12 });
    expect(consoleSpy).toHaveBeenCalledWith('Result:', 20);
  });

  it('shall handle multiple statements', () => {
    execute(`
      const sum = $math.sum(a, b);
      const product = $math.mul(a, b);
      $logger("Sum:", sum, "Product:", product);
    `, { a: 4, b: 5 });
    expect(consoleSpy).toHaveBeenCalledWith('Sum:', 9, 'Product:', 20);
  });

  it('shall handle conditional logic', () => {
    execute('if (x > y) $logger("x is greater"); else $logger("y is greater or equal")', { x: 10, y: 5 });
    expect(consoleSpy).toHaveBeenCalledWith('x is greater');

    execute('if (x > y) $logger("x is greater"); else $logger("y is greater or equal")', { x: 3, y: 8 });
    expect(consoleSpy).toHaveBeenCalledWith('y is greater or equal');
  });

  it('shall handle loops', () => {
    execute('for (let i = 0; i < count; i++) $logger("Iteration:", i)', { count: 3 });
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Iteration:', 0);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Iteration:', 1);
    expect(consoleSpy).toHaveBeenNthCalledWith(3, 'Iteration:', 2);
  });

  it('shall handle arrays and objects', () => {
    execute('$logger(arr.length, obj.name)', { arr: [1, 2, 3], obj: { name: 'test' } });
    expect(consoleSpy).toHaveBeenCalledWith(3, 'test');

    execute('$logger(numbers.map(n => $math.mul(n, 2)))', { numbers: [1, 2, 3] });
    expect(consoleSpy).toHaveBeenCalledWith([2, 4, 6]);
  });

  it('shall handle string manipulation', () => {
    execute('$logger(str.toUpperCase(), str.length)', { str: 'hello' });
    expect(consoleSpy).toHaveBeenCalledWith('HELLO', 5);
  });

  it('shall handle boolean operations', () => {
    execute('$logger(flag && other, flag || other)', { flag: true, other: false });
    expect(consoleSpy).toHaveBeenCalledWith(false, true);
  });

  it('shall handle undefined variables gracefully', () => {
    execute('$logger(typeof undefinedVar)');
    expect(consoleSpy).toHaveBeenCalledWith('undefined');
  });

  it('shall handle null values', () => {
    execute('$logger(nullValue === null)', { nullValue: null });
    expect(consoleSpy).toHaveBeenCalledWith(true);
  });

  it('shall handle nested function calls', () => {
    execute('$logger($math.sum($math.sum(a, b), $math.mul(c, d)))', { a: 1, b: 2, c: 3, d: 4 });
    expect(consoleSpy).toHaveBeenCalledWith(15); // (1+2) + (3*4) = 15
  });

  it('shall handle return values from executed code', () => {
    // Note: execute function doesn't return values, it just executes
    execute('const result = $math.sum(5, 10); $logger(result)');
    expect(consoleSpy).toHaveBeenCalledWith(15);
  });

  it('shall handle empty code', () => {
    expect(() => execute('')).not.toThrow();
  });

  it('shall handle empty variables object', () => {
    execute('$logger("test")');
    expect(consoleSpy).toHaveBeenCalledWith('test');
  });

  it('shall handle variables with special names', () => {
    execute('$logger($var, _var, var123)', { '$var': 'dollar', '_var': 'underscore', 'var123': 'numeric' });
    expect(consoleSpy).toHaveBeenCalledWith('dollar', 'underscore', 'numeric');
  });

  it('shall maintain $math immutability', () => {
    execute(`
      try {
        $math.sum = function() { return 'hacked'; };
        $logger('Failed to maintain immutability');
      } catch (e) {
        $logger('$math is properly immutable');
      }
    `);
    expect(consoleSpy).toHaveBeenCalledWith('$math is properly immutable');
  });

  it('shall handle errors in user code', () => {
    expect(() => execute('throw new Error("test error")')).toThrow('test error');
    expect(() => execute('nonExistentFunction()')).toThrow();
  });

  it('shall handle syntax errors', () => {
    expect(() => execute('invalid javascript {')).toThrow();
    expect(() => execute('$logger(unclosed string')).toThrow();
  });

  it('shall handle division by zero in custom operations', () => {
    execute('$logger(a / b)', { a: 10, b: 0 });
    expect(consoleSpy).toHaveBeenCalledWith(Infinity);
  });

  it('shall handle large numbers', () => {
    execute('$logger($math.sum(a, b))', { a: Number.MAX_SAFE_INTEGER, b: 1 });
    expect(consoleSpy).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER + 1);
  });

  it('shall handle functions as variables', () => {
    const customFunc = (x) => x * 2;
    execute('$logger(fn(5))', { fn: customFunc });
    expect(consoleSpy).toHaveBeenCalledWith(10);
  });

  it('shall handle async-like operations (though execute is sync)', () => {
    execute(`
      const arr = [1, 2, 3];
      const doubled = arr.map(x => $math.mul(x, 2));
      $logger('Doubled:', doubled);
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Doubled:', [2, 4, 6]);
  });

  it('shall preserve proper this context for $logger', () => {
    // $logger should work like console.log
    execute('$logger("test message")');
    expect(consoleSpy).toHaveBeenCalledWith('test message');
  });

  it('shall handle variable shadowing', () => {
    // Globals should NOT be shadowed - they are "always available"
    execute('$logger($math.sum(1, 2))', { $math: 'shadowed' });
    expect(consoleSpy).toHaveBeenCalledWith(3);

    // Test that user variables with different names work normally
    execute('$logger(userVar)', { userVar: 'test' });
    expect(consoleSpy).toHaveBeenCalledWith('test');

    // Test that attempting to modify frozen $math throws an error
    expect(() => {
      execute('$math.sum = "hacked"; $logger($math.sum(1,2))', { $math: 'ignored' });
    }).toThrow();
  });

  it('shall handle variable declarations and scope', () => {
    execute(`
      let x = 5;
      const y = 10;
      var z = x + y;
      $logger('Variables:', x, y, z);
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Variables:', 5, 10, 15);
  });

  it('shall handle destructuring assignment', () => {
    execute(`
      const obj = { name: 'Alice', age: 30 };
      const arr = [1, 2, 3, 4, 5];
      const { name, age } = obj;
      const [first, second, ...rest] = arr;
      $logger('Destructured:', name, age, first, second, rest);
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Destructured:', 'Alice', 30, 1, 2, [3, 4, 5]);
  });

  it('shall handle arrow functions and callbacks', () => {
    execute(`
      const numbers = [1, 2, 3, 4, 5];
      const doubled = numbers.map(n => n * 2);
      const evens = numbers.filter(n => n % 2 === 0);
      const sum = numbers.reduce((acc, n) => acc + n, 0);
      $logger('Transformed:', doubled, evens, sum);
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Transformed:', [2, 4, 6, 8, 10], [2, 4], 15);
  });

  it('shall handle object methods and this context', () => {
    execute(`
      const calculator = {
        value: 0,
        add(n) { this.value += n; return this; },
        multiply(n) { this.value *= n; return this; },
        get result() { return this.value; }
      };
      calculator.add(5).multiply(3);
      $logger('Calculator result:', calculator.result);
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Calculator result:', 15);
  });

  it('shall handle classes and inheritance', () => {
    execute(`
      class Animal {
        constructor(name) { this.name = name; }
        speak() { return \`\${this.name} makes a sound\`; }
      }
      class Dog extends Animal {
        speak() { return \`\${this.name} barks\`; }
      }
      const dog = new Dog('Rex');
      $logger(dog.speak());
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Rex barks');
  });

  it('shall handle Set and Map data structures', () => {
    execute(`
      const uniqueNumbers = new Set([1, 2, 2, 3, 3, 4]);
      const keyValuePairs = new Map([['a', 1], ['b', 2]]);
      keyValuePairs.set('c', 3);
      $logger('Set size:', uniqueNumbers.size);
      $logger('Map values:', Array.from(keyValuePairs.values()));
    `);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Set size:', 4);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Map values:', [1, 2, 3]);
  });

  it('shall handle try-catch error handling', () => {
    execute(`
      try {
        const data = JSON.parse('{"valid": "json"}');
        $logger('Parsed successfully:', data.valid);
      } catch (error) {
        $logger('Parse error:', error.message);
      }

      try {
        JSON.parse('invalid json');
      } catch (error) {
        $logger('Caught error:', error.name);
      }
    `);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Parsed successfully:', 'json');
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Caught error:', 'SyntaxError');
  });

  it('shall handle regular expressions', () => {
    execute(`
      const text = 'The quick brown fox jumps over the lazy dog';
      const pattern = /\\b\\w{4}\\b/g;
      const fourLetterWords = text.match(pattern);
      const hasNumbers = /\\d/.test('abc123');
      $logger('Four letter words:', fourLetterWords);
      $logger('Has numbers:', hasNumbers);
    `);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Four letter words:', ['over', 'lazy']);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Has numbers:', true);
  });

  it('shall handle JSON operations', () => {
    execute(`
      const obj = { name: 'Alice', age: 30, hobbies: ['reading', 'coding'] };
      const jsonString = JSON.stringify(obj);
      const parsed = JSON.parse(jsonString);
      $logger('Original:', obj);
      $logger('Stringified length:', jsonString.length);
      $logger('Parsed back:', parsed);
    `);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Original:', { name: 'Alice', age: 30, hobbies: ['reading', 'coding'] });
    expect(consoleSpy).toHaveBeenNthCalledWith(3, 'Parsed back:', { name: 'Alice', age: 30, hobbies: ['reading', 'coding'] });
  });

  it('shall handle setTimeout simulation with immediate execution', () => {
    execute(`
      let counter = 0;
      function increment() { counter++; }
      // Simulate setTimeout with immediate execution for testing
      increment();
      increment();
      $logger('Counter:', counter);
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Counter:', 2);
  });

  it('shall handle complex algorithms', () => {
    execute(`
      // Fibonacci sequence
      function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }

      // Binary search
      function binarySearch(arr, target) {
        let left = 0, right = arr.length - 1;
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (arr[mid] === target) return mid;
          if (arr[mid] < target) left = mid + 1;
          else right = mid - 1;
        }
        return -1;
      }

      const fibResult = fibonacci(7);
      const searchResult = binarySearch([1, 3, 5, 7, 9, 11], 7);
      $logger('Fibonacci(7):', fibResult);
      $logger('Binary search for 7:', searchResult);
    `);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Fibonacci(7):', 13);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Binary search for 7:', 3);
  });

  it('shall handle closures and lexical scope', () => {
    execute(`
      function createCounter(initial) {
        let count = initial;
        return function(increment = 1) {
          count += increment;
          return count;
        };
      }

      const counter = createCounter(10);
      const result1 = counter();
      const result2 = counter(5);
      $logger('Counter results:', result1, result2);
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Counter results:', 11, 16);
  });

  it('shall handle object property manipulation', () => {
    execute(`
      const obj = { a: 1, b: 2 };
      Object.defineProperty(obj, 'c', {
        value: 3,
        enumerable: true,
        writable: false
      });

      const keys = Object.keys(obj);
      const values = Object.values(obj);
      const entries = Object.entries(obj);

      $logger('Keys:', keys);
      $logger('Values:', values);
      $logger('Entries:', entries);
    `);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Keys:', ['a', 'b', 'c']);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Values:', [1, 2, 3]);
    expect(consoleSpy).toHaveBeenNthCalledWith(3, 'Entries:', [['a', 1], ['b', 2], ['c', 3]]);
  });

  it('shall handle Date operations', () => {
    execute(`
      const now = new Date();
      const specificDate = new Date('2023-12-25');
      const timestamp = Date.now();

      $logger('Year:', now.getFullYear());
      $logger('Christmas month:', specificDate.getMonth() + 1); // Month is 0-indexed
      $logger('Timestamp type:', typeof timestamp);
    `);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Christmas month:', 12);
    expect(consoleSpy).toHaveBeenNthCalledWith(3, 'Timestamp type:', 'number');
  });

  it('shall handle Math object operations', () => {
    execute(`
      const numbers = [3.7, -2.1, 5.9, -8.3];
      const results = {
        max: Math.max(...numbers),
        min: Math.min(...numbers),
        rounded: numbers.map(n => Math.round(n)),
        random: typeof Math.random()
      };
      $logger('Math results:', results);
    `);
    expect(consoleSpy).toHaveBeenCalledWith('Math results:', {
      max: 5.9,
      min: -8.3,
      rounded: [4, -2, 6, -8],
      random: 'number'
    });
  });

  it('shall handle variable hoisting and function declarations', () => {
    execute(`
      $logger('Before declaration:', typeof hoistedFunction);

      function hoistedFunction() {
        return 'I am hoisted!';
      }

      $logger('After declaration:', hoistedFunction());

      // var is hoisted but not initialized
      $logger('Var before declaration:', typeof hoistedVar);
      var hoistedVar = 'Now I have a value';
      $logger('Var after assignment:', hoistedVar);
    `);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Before declaration:', 'function');
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'After declaration:', 'I am hoisted!');
    expect(consoleSpy).toHaveBeenNthCalledWith(3, 'Var before declaration:', 'undefined');
    expect(consoleSpy).toHaveBeenNthCalledWith(4, 'Var after assignment:', 'Now I have a value');
  });

  it('shall handle complex nested operations with user variables', () => {
    execute(`
      const processData = (data) => {
        return data
          .filter(item => item.active)
          .map(item => ({
            ...item,
            displayName: \`\${item.name} (\${item.type})\`,
            score: $math.mul(item.value, multiplier)
          }))
          .sort((a, b) => b.score - a.score);
      };

      const result = processData(dataset);
      $logger('Processed items:', result.length);
      $logger('Top item:', result[0]);
    `, {
      dataset: [
        { name: 'Alpha', type: 'premium', value: 10, active: true },
        { name: 'Beta', type: 'basic', value: 5, active: false },
        { name: 'Gamma', type: 'premium', value: 8, active: true }
      ],
      multiplier: 1.5
    });

    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Processed items:', 2);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Top item:', {
      name: 'Alpha',
      type: 'premium',
      value: 10,
      active: true,
      displayName: 'Alpha (premium)',
      score: 15
    });
  });
});
