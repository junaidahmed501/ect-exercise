const { deepCopy } = require('./q1_deepCopy');

describe('deepCopy Q(1)', () => {
  it('shall copy numbers correctly', () => {
    const num = 42;
    const cp = deepCopy(num);
    expect(cp).toBe(num);
  });

  it('shall copy strings correctly', () => {
    const str = 'hello';
    const cp = deepCopy(str);
    expect(cp).toBe(str);
  });

  it('shall copy null correctly', () => {
    const val = null;
    const cp = deepCopy(val);
    expect(cp).toBeNull();
  });

  it('shall copy undefined correctly', () => {
    const val = undefined;
    const cp = deepCopy(val);
    expect(cp).toBeUndefined();
  });

  it('shall copy Date objects correctly', () => {
    const date = new Date();
    const cp = deepCopy(date);
    expect(cp).not.toBe(date);
    expect(cp).toEqual(date);
    expect(cp instanceof Date).toBe(true);
  });

  it('shall copy plain objects correctly', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cp = deepCopy(obj);
    expect(cp).not.toBe(obj);
    expect(cp).toEqual(obj);
    expect(cp.b).not.toBe(obj.b);
  });

  it('shall copy arrays correctly', () => {
    const arr = [1, 2, { a: 3 }];
    const cp = deepCopy(arr);
    expect(cp).not.toBe(arr);
    expect(cp).toEqual(arr);
    expect(cp[2]).not.toBe(arr[2]);
  });

  it('shall copy Map objects correctly', () => {
    const map = new Map();
    map.set('a', 1);
    map.set('b', { c: 2 });
    const cp = deepCopy(map);
    expect(cp).not.toBe(map);
    expect(cp instanceof Map).toBe(true);
    expect(cp.size).toBe(map.size);
    expect(cp.get('a')).toBe(1);
    expect(cp.get('b')).toEqual({ c: 2 });
    expect(cp.get('b')).not.toBe(map.get('b'));
  });

  it('shall handle cyclic references', () => {
    const obj = { a: 1 };
    obj.self = obj;
    const cp = deepCopy(obj);
    expect(cp).not.toBe(obj);
    expect(cp.a).toBe(1);
    expect(cp.self).toBe(cp);
  });

  it('shall handle nested circular references', () => {
    const obj1 = { name: 'obj1' };
    const obj2 = { name: 'obj2', ref: obj1 };
    obj1.ref = obj2;

    const cp = deepCopy(obj1);
    expect(cp).not.toBe(obj1);
    expect(cp.ref).not.toBe(obj2);
    expect(cp.ref.ref).toBe(cp);
  });

  it('shall handle circular references in arrays', () => {
    const arr = [1, 2];
    arr.push(arr);

    const cp = deepCopy(arr);
    expect(cp).not.toBe(arr);
    expect(cp[2]).toBe(cp);
  });

  it('shall handle circular references with Date objects', () => {
    const obj = {
      timestamp: new Date(),
      data: { value: 42 }
    };
    obj.data.parent = obj;

    const cp = deepCopy(obj);
    expect(cp).not.toBe(obj);
    expect(cp.timestamp).not.toBe(obj.timestamp);
    expect(cp.timestamp).toEqual(obj.timestamp);
    expect(cp.data.parent).toBe(cp);
  });

  it('shall handle Map with circular references', () => {
    const map = new Map();
    const obj = { map: map };
    map.set('self', obj);

    const cp = deepCopy(map);
    expect(cp.get('self').map).toBe(cp);
  });

  it('shall handle empty objects and arrays', () => {
    expect(deepCopy({})).toEqual({});
    expect(deepCopy([])).toEqual([]);
    expect(deepCopy(new Map())).toEqual(new Map());
  });

  it('shall ignore functions', () => {
    function fn() { return 42; }
    const cp = deepCopy(fn);
    expect(cp).toBe(fn);
  });

  it('shall ignore symbols', () => {
    const sym = Symbol('test');
    const cp = deepCopy(sym);
    expect(cp).toBe(sym);
  });

  it('shall ignore Set objects', () => {
    const set = new Set([1, 2, 3]);
    const cp = deepCopy(set);
    expect(cp).toBe(set);
  });

  it('shall ignore RegExp objects', () => {
    const regex = /abc/g;
    const cp = deepCopy(regex);
    expect(cp).toBe(regex);
  });

  it('shall ignore Error objects', () => {
    const err = new Error('fail');
    const cp = deepCopy(err);
    expect(cp).toBe(err);
  });

  it('shall ignore WeakMap and WeakSet', () => {
    const wm = new WeakMap();
    const ws = new WeakSet();
    expect(deepCopy(wm)).toBe(wm);
    expect(deepCopy(ws)).toBe(ws);
  });

  it('shall check modifying original object does not affect the copy', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cp = deepCopy(obj);
    obj.a = 100;
    obj.b.c = 200;
    expect(cp.a).toBe(1);
    expect(cp.b.c).toBe(2);
  });

  it('shall check modifying copy does not affect the original object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cp = deepCopy(obj);
    cp.a = 100;
    cp.b.c = 200;
    expect(obj.a).toBe(1);
    expect(obj.b.c).toBe(2);
  });

  it('shall check modifying original array does not affect the copy', () => {
    const arr = [1, 2, { a: 3 }];
    const cp = deepCopy(arr);
    arr[0] = 100;
    arr[2].a = 200;
    expect(cp[0]).toBe(1);
    expect(cp[2].a).toBe(3);
  });

  it('shall check modifying copy array does not affect the original', () => {
    const arr = [1, 2, { a: 3 }];
    const cp = deepCopy(arr);
    cp[0] = 100;
    cp[2].a = 200;
    expect(arr[0]).toBe(1);
    expect(arr[2].a).toBe(3);
  });

  it('shall check modifying original Map does not affect the copy', () => {
    const map = new Map();
    map.set('a', 1);
    map.set('b', { c: 2 });
    const cp = deepCopy(map);
    map.set('a', 100);
    map.get('b').c = 200;
    expect(cp.get('a')).toBe(1);
    expect(cp.get('b').c).toBe(2);
  });

  it('shall check modifying copy Map does not affect the original', () => {
    const map = new Map();
    map.set('a', 1);
    map.set('b', { c: 2 });
    const cp = deepCopy(map);
    cp.set('a', 100);
    cp.get('b').c = 200;
    expect(map.get('a')).toBe(1);
    expect(map.get('b').c).toBe(2);
  });

  it('shall check modifying original Date does not affect the copy', () => {
    const date = new Date('2020-01-01T00:00:00Z');
    const cp = deepCopy(date);
    date.setFullYear(2030);
    expect(cp.getFullYear()).toBe(2020);
  });

  it('shall check modifying copy Date does not affect the original', () => {
    const date = new Date('2020-01-01T00:00:00Z');
    const cp = deepCopy(date);
    cp.setFullYear(2030);
    expect(date.getFullYear()).toBe(2020);
  });

});
