import { CustomSortPipe } from './custom-sort.pipe';

describe('CustomSortPipe', () => {
  let pipe: CustomSortPipe;

  beforeEach(() => {
    pipe = new CustomSortPipe();
  });

  it('should sort by string field ascending', () => {
    const data = [{ name: 'John' }, { name: 'Alice' }, { name: 'Bob' }];
    const result = pipe.transform(data, 'name');
    expect(result[0].name).toBe('Alice');
    expect(result[2].name).toBe('John');
  });

  it('should sort by string field descending', () => {
    const data = [{ name: 'Alice' }, { name: 'John' }, { name: 'Bob' }];
    const result = pipe.transform(data, '-name');
    expect(result[0].name).toBe('John');
    expect(result[2].name).toBe('Alice');
  });

  it('should sort by multiple criteria', () => {
    const data = [
      { name: 'John', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'John', age: 20 }
    ];
    const result = pipe.transform(data, ['name', '-age']);
    expect(result[0]).toEqual({ name: 'Alice', age: 25 });
    expect(result[1]).toEqual({ name: 'John', age: 30 });
    expect(result[2]).toEqual({ name: 'John', age: 20 });
  });

  it('should sort dates', () => {
    const data = [
      { date: new Date('2024-01-15') },
      { date: new Date('2024-01-10') },
      { date: new Date('2024-01-20') }
    ];
    const result = pipe.transform(data, 'date');
    expect(result[0].date.getTime()).toBe(new Date('2024-01-10').getTime());
    expect(result[2].date.getTime()).toBe(new Date('2024-01-20').getTime());
  });

  it('should return original array if no criteria', () => {
    const data = [{ name: 'John' }];
    const result = pipe.transform(data, '');
    expect(result).toBe(data);
  });

  it('should handle primitive arrays', () => {
    const data = [{ tags: ['b', 'a'] }, { tags: ['a', 'b'] }];
    const result = pipe.transform(data, 'tags');
    expect(result[0].tags).toEqual(['a', 'b']);
    expect(result[1].tags).toEqual(['b', 'a']);
  });

  // Tests for data types NOT mentioned in requirements
  describe('Data types not required by exercise but handled', () => {

    it('should handle boolean values', () => {
      const data = [
        { active: true },
        { active: false },
        { active: true }
      ];
      const result = pipe.transform(data, 'active');
      expect(result[0].active).toBe(false);
      expect(result[1].active).toBe(true);
      expect(result[2].active).toBe(true);
    });

    it('should handle objects by JSON comparison', () => {
      const data = [
        { config: { theme: 'dark', size: 'large' } },
        { config: { theme: 'light', size: 'small' } },
        { config: { theme: 'dark', size: 'medium' } }
      ];
      const result = pipe.transform(data, 'config');
      expect(result[0].config.theme).toBe('dark');
      expect(result[0].config.size).toBe('large');
    });

    it('should handle null and undefined values', () => {
      const data = [
        { value: 'test' },
        { value: null },
        { value: undefined },
        { value: 'another' }
      ];
      const result = pipe.transform(data, 'value');
      expect(result[0].value).toBe(null);
      expect(result[1].value).toBe(undefined);
      expect(result[2].value).toBe('another');
      expect(result[3].value).toBe('test');
    });

    it('should handle mixed primitive types by converting to strings', () => {
      const data = [
        { mixed: 123 },
        { mixed: 'abc' },
        { mixed: true },
        { mixed: 45 }
      ];
      const result = pipe.transform(data, 'mixed');
      expect(result[0].mixed).toBe(45);
      expect(result[1].mixed).toBe(123);
      expect(result[2].mixed).toBe('abc');
      expect(result[3].mixed).toBe(true);
    });
  });

  // Tests for data types NOT handled by your pipe implementation
  describe('Data types not handled by current implementation', () => {

    it('should fallback to string comparison for functions', () => {
      const func1 = function a() { return 'first'; };
      const func2 = function b() { return 'second'; };
      const data = [{ fn: func2 }, { fn: func1 }];
      const result = pipe.transform(data, 'fn');
      expect(result[0].fn).toBe(func1);
      expect(result[1].fn).toBe(func2);
    });

    it('should fallback to string comparison for symbols', () => {
      const sym1 = Symbol('first');
      const sym2 = Symbol('second');
      const data = [{ sym: sym2 }, { sym: sym1 }];
      const result = pipe.transform(data, 'sym');
      expect(result[0].sym).toBe(sym1);
      expect(result[1].sym).toBe(sym2);
    });

    it('should fallback to string comparison for BigInt', () => {
      const data = [
        { big: BigInt(300) },
        { big: BigInt(100) },
        { big: BigInt(200) }
      ];
      const result = pipe.transform(data, 'big');
      expect(result[0].big.toString()).toBe('100');
      expect(result[1].big.toString()).toBe('200');
      expect(result[2].big.toString()).toBe('300');
    });

    it('should treat RegExp as objects and use JSON comparison', () => {
      const data = [
        { regex: /z/ },
        { regex: /a/ },
        { regex: /m/ }
      ];
      const result = pipe.transform(data, 'regex');
      expect(result[0].regex.source).toBe('z');
      expect(result[1].regex.source).toBe('a');
      expect(result[2].regex.source).toBe('m');
    });

    it('should treat Map as objects and use JSON comparison', () => {
      const map1 = new Map([['key', 'first']]);
      const map2 = new Map([['key', 'second']]);
      const data = [{ map: map2 }, { map: map1 }];
      const result = pipe.transform(data, 'map');
      expect(result[0].map).toBe(map2);
      expect(result[1].map).toBe(map1);
    });

    it('should treat Set as objects and use JSON comparison', () => {
      const set1 = new Set(['first']);
      const set2 = new Set(['second']);
      const data = [{ set: set2 }, { set: set1 }];
      const result = pipe.transform(data, 'set');
      expect(result[0].set).toBe(set2);
      expect(result[1].set).toBe(set1);
    });
  });

  describe('Edge cases', () => {

    it('should handle empty arrays', () => {
      const result = pipe.transform([], 'name');
      expect(result).toEqual([]);
    });

    it('should handle empty criteria array', () => {
      const data = [{ name: 'John' }, { name: 'Alice' }];
      const result = pipe.transform(data, []);
      expect(result).toEqual(data);
    });

    it('should handle missing properties', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Alice' },
        { name: 'Bob', age: 25 }
      ];
      const result = pipe.transform(data, 'age');
      expect(result[0].name).toBe('Alice');
      expect(result[1].age).toBe(25);
      expect(result[2].age).toBe(30);
    });

    it('should handle deeply nested arrays', () => {
      const data = [
        { nested: [[3, 2], [1]] },
        { nested: [[1, 2], [3]] },
        { nested: [[2, 1], [2]] }
      ];
      const result = pipe.transform(data, 'nested');
      expect(result[0].nested).toEqual([[1, 2], [3]]);
      expect(result[1].nested).toEqual([[2, 1], [2]]);
      expect(result[2].nested).toEqual([[3, 2], [1]]);
    });
  });
});
