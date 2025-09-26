import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customSort',
})
export class CustomSortPipe implements PipeTransform {

  transform(items: any[], criteria: string | string[]): any[] {
    if (!items || !criteria) {
      return items;
    }

    // Convert single criteria to array for uniform processing
    const sortCriteria = Array.isArray(criteria) ? criteria : [criteria];

    // Pre-compute all values to avoid repeated calculations
    const itemsWithValues = items.map(item => ({
      item,
      values: sortCriteria.map(criterion => {
        const isDescending = criterion.startsWith('-');
        const field = isDescending ? criterion.substring(1) : criterion;
        return {
          value: item && item[field] !== undefined ? item[field] : undefined,
          descending: isDescending
        };
      })
    }));

    return itemsWithValues
      .sort((a, b) => {
        for (let i = 0; i < a.values.length; i++) {
          const comparison = this.compareValues(
            a.values[i].value,
            b.values[i].value
          );
          if (comparison !== 0) {
            return a.values[i].descending ? -comparison : comparison;
          }
        }
        return 0;
      })
      .map(({ item }) => item);
  }

  private compareValues(a: any, b: any): number {
    // Handle null/undefined
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    // Handle dates
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }

    // Handle arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      const minLength = Math.min(a.length, b.length);
      for (let i = 0; i < minLength; i++) {
        const comparison = this.compareValues(a[i], b[i]);
        if (comparison !== 0) return comparison;
      }
      return a.length - b.length;
    }

    // Handle objects (simple comparison using JSON.stringify)
    if (typeof a === 'object' && typeof b === 'object') {
      const aStr = JSON.stringify(a);
      const bStr = JSON.stringify(b);
      return aStr.localeCompare(bStr);
    }

    // Handle numbers
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    // Handle booleans
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return a === b ? 0: (a ? 1 : -1);
    }

    // Handle strings and other primitives
    const aStr = String(a);
    const bStr = String(b);
    return aStr.localeCompare(bStr);
  }
}
