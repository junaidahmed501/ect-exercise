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
});
