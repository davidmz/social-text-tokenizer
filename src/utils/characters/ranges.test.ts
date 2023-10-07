import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';

import { addRange, removeRange } from './ranges';

describe('addRange', () => {
  it(`should add single code to an empty ranges`, () => {
    expect(addRange([], 1)).toEqual([[1, 1]]);
  });

  it('should add range with incorrect codes order', () => {
    expect(addRange([], [2, 1])).toEqual([[1, 2]]);
  });

  it('should add range before existing ones', () => {
    expect(
      addRange(
        // prettier-ignore
        [[10, 20], [30, 40]],
        [3, 4],
      ),
    ).toEqual(
      // prettier-ignore
      [[3, 4], [10, 20], [30, 40]],
    );
  });

  it('should add range after existing ones', () => {
    expect(
      addRange(
        // prettier-ignore
        [[10, 20], [30, 40]],
        [50, 60],
      ),
    ).toEqual(
      // prettier-ignore
      [[10, 20], [30, 40], [50, 60]],
    );
  });

  it('should add range, adjacent at right', () => {
    expect(addRange([[10, 20]], [21, 22])).toEqual([[10, 22]]);
  });

  it('should add range, adjacent at left', () => {
    expect(addRange([[10, 20]], [8, 9])).toEqual([[8, 20]]);
  });

  it('should add range that fits in existing one', () => {
    expect(addRange([[10, 20]], [11, 12])).toEqual([[10, 20]]);
  });

  it('should add range that joins the existing ones', () => {
    expect(
      addRange(
        // prettier-ignore
        [[10, 20], [30, 40]],
        [11, 33],
      ),
    ).toEqual([[10, 40]]);
  });
});

describe('removeRange', () => {
  it(`should remove single code from an empty ranges`, () => {
    expect(removeRange([], 1)).toEqual([]);
  });

  it(`should remove non-existing code`, () => {
    expect(removeRange([[2, 3]], 1)).toEqual([[2, 3]]);
  });

  it(`should split range by removed code`, () => {
    expect(removeRange([[1, 5]], 3)).toEqual([
      [1, 2],
      [4, 5],
    ]);
  });

  it(`should remove range from both sides`, () => {
    expect(
      removeRange(
        // prettier-ignore
        [[1, 5], [7, 10]],
        [5, 7],
      ),
    ).toEqual(
      // prettier-ignore
      [[1, 4], [8, 10]],
    );
  });

  it(`should not touch ranges`, () => {
    expect(
      removeRange(
        // prettier-ignore
        [[1, 5], [7, 10]],
        [11, 12],
      ),
    ).toEqual(
      // prettier-ignore
      [[1, 5], [7, 10]],
    );
  });
});
