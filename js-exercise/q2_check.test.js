const { check } = require('./q2_check');

describe('check (Q2)', () => {
  it('prompt examples', () => {
    const data1 = { a: 17, b: { c: 'Test', d: null } };
    const data2 = { a: 17, b: { c: 'Test' } };
    const data3 = { a: 17, b: null };
    expect(check(data1, data2)).toBe(true);
    expect(check(data1, data3)).toBe(false);
  });

  it('primitives & specials', () => {
    expect(check(1, 1)).toBe(true);
    expect(check('x', 'x')).toBe(true);
    expect(check(true, true)).toBe(true);
    expect(check(null, undefined)).toBe(true); // special rule
    expect(check(NaN, NaN)).toBe(true);        // chosen rule
    expect(check(0, -0)).toBe(true);           // chosen rule
    expect(check(1, '1')).toBe(false);
  });

  it('dates', () => {
    expect(check(new Date(0), new Date(0))).toBe(true);
    expect(check(new Date(0), new Date(1))).toBe(false);
    expect(check({ d: new Date(5) }, { d: new Date(5) })).toBe(true);
  });

  it('arrays', () => {
    expect(check([1,2,3], [1,2,3])).toBe(true);
    expect(check([1,{a:2}], [1,{a:2}])).toBe(true);
    expect(check([1,2], [2,1])).toBe(false); // order matters
  });

  it('objects (own enumerable keys, order-agnostic)', () => {
    const a = { x:1, y:{ z:2 } };
    const b = { y:{ z:2 }, x:1 };
    expect(check(a, b)).toBe(true);

    const c = { x:1, y:{ z:3 } };
    expect(check(a, c)).toBe(false);
  });

  it('null vs undefined vs false', () => {
    expect(check(null, undefined)).toBe(true);
    expect(check(undefined, null)).toBe(true);
    expect(check(null, false)).toBe(false);
    expect(check(undefined, false)).toBe(false);
  });

  it('NaN, Infinity, -Infinity', () => {
    expect(check(NaN, NaN)).toBe(true);
    expect(check(Infinity, Infinity)).toBe(true);
    expect(check(-Infinity, -Infinity)).toBe(true);
    expect(check(Infinity, -Infinity)).toBe(false);
    expect(check(NaN, 0)).toBe(false);
  });

  it('0, -0, +0', () => {
    expect(check(0, -0)).toBe(true);
    expect(check(0, +0)).toBe(true);
    expect(check(-0, +0)).toBe(true);
  });

  it('boolean vs number/string', () => {
    expect(check(true, 1)).toBe(false);
    expect(check(false, 0)).toBe(false);
    expect(check(true, 'true')).toBe(false);
  });

  it('symbol', () => {
    const s1 = Symbol('a');
    const s2 = Symbol('a');
    expect(check(s1, s1)).toBe(true);
    expect(check(s1, s2)).toBe(false);
  });

  it('empty objects and arrays', () => {
    expect(check({}, {})).toBeTruthy();
    expect(check([], [])).toBeTruthy();
    expect(check({}, [])).toBeFalsy();
    expect(check([], {})).toBeFalsy();
  });

  it('objects with extra/missing keys', () => {
    expect(check({a:1}, {a:1, b:2})).toBe(true);
    expect(check({a:1, b:2}, {a:1})).toBe(true);
    expect(check({a:1, b:undefined}, {a:1})).toBe(true);
    expect(check({a:1}, {a:1, b:undefined})).toBe(true);
  });

  it('objects with undefined/null values', () => {
    expect(check({a:undefined}, {a:null})).toBe(true);
    expect(check({a:null}, {a:undefined})).toBe(true);
    expect(check({a:undefined}, {a:1})).toBe(false);
  });

  it('objects with symbol keys', () => {
    const s = Symbol('s');
    const a = { [s]: 1 };
    const b = { [s]: 1 };
    expect(check(a, b)).toBe(true); // symbol as key, return true
    const c = { [s]: 2 };
    expect(check(a, c)).toBe(true);
  });

  it('objects with non-enumerable properties', () => {
    const a = {};
    Object.defineProperty(a, 'x', { value: 1, enumerable: false });
    const b = {};
    expect(check(a, b)).toBe(true);
  });

  it('arrays with holes (sparse arrays)', () => {
    const a = [];
    a[2] = 1;
    const b = [undefined, undefined, 1];
    expect(check(a, b)).toBe(true);
  });

  it('arrays with different lengths', () => {
    expect(check([1,2], [1,2,3])).toBe(false);
    expect(check([1,2,3], [1,2])).toBe(false);
  });

  it('arrays with nested arrays/objects', () => {
    expect(check([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(check([1, [2, 3]], [1, [3, 2]])).toBe(false);
  });

  it('date vs non-date', () => {
    expect(check(new Date(0), 0)).toBe(false);
    expect(check(new Date(0), '1970-01-01T00:00:00.000Z')).toBe(false);
  });

  it('invalid dates', () => {
    expect(check(new Date('invalid'), new Date('invalid'))).toBe(false);
  });

  it('functions, RegExp, Set, Map, WeakMap, WeakSet, Error', () => {
    function f1() {}
    function f2() {}
    expect(check(f1, f1)).toBe(true);
    expect(check(f1, f2)).toBe(false);
    expect(check(/a/, /a/)).toBe(false);
    expect(check(new Set([1]), new Set([1]))).toBe(false);
    expect(check(new Map([[1,2]]), new Map([[1,2]]))).toBe(false);
    expect(check(new WeakMap(), new WeakMap())).toBe(false);
    expect(check(new WeakSet(), new WeakSet())).toBe(false);
    expect(check(new Error('x'), new Error('x'))).toBe(false);
  });

  it('deeply nested objects', () => {
    const a = { x: { y: { z: { w: 1 } } } };
    const b = { x: { y: { z: { w: 1 } } } };
    expect(check(a, b)).toBe(true);
    const c = { x: { y: { z: { w: 2 } } } };
    expect(check(a, c)).toBe(false);
  });

  it('deeply nested arrays', () => {
    const a = [[[[1]]]];
    const b = [[[[1]]]];
    expect(check(a, b)).toBe(true);
    const c = [[[[2]]]];
    expect(check(a, c)).toBe(false);
  });

  it('mixed types in arrays/objects', () => {
    expect(check([{a:1}, 2, [3]], [{a:1}, 2, [3]])).toBe(true);
    expect(check([{a:1}, 2, [3]], [{a:1}, 2, [4]])).toBe(false);
  });

  it('object with prototype properties', () => {
    function A() { this.x = 1; }
    A.prototype.y = 2;
    const a = new A();
    const b = { x: 1 };
    expect(check(a, b)).toBe(true);
  });

  it('large objects/arrays', () => {
    const a = Array(1000).fill(1);
    const b = Array(1000).fill(1);
    expect(check(a, b)).toBe(true);
    b[999] = 2;
    expect(check(a, b)).toBe(false);
  });
});
