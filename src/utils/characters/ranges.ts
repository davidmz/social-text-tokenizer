import type { Range, TupleArg } from './types';

function range(t: TupleArg): Range {
  if (typeof t === 'number') {
    return [t, t];
  }
  return t[0] <= t[1] ? [t[0], t[1]] : [t[1], t[0]];
}

/**
 * Returns new ranges array that merges the given ranges and t.
 *
 * @param ranges normalized ranges. This means that they are sorted in ascending
 * order, and separated by at least one code.
 * @param t new TupleArg to add to ranges.
 */
export function addRange(ranges: Range[], t: TupleArg): Range[] {
  const [start, end] = range(t);

  const rangesBefore = [];
  const rangesAfter = [];
  const rangesMiddle = [];
  for (const range of ranges) {
    if (start > range[1] + 1) {
      rangesBefore.push(range);
    } else if (end < range[0] - 1) {
      rangesAfter.push(range);
    } else {
      rangesMiddle.push(range);
    }
  }

  if (rangesMiddle.length === 0) {
    return [...rangesBefore, [start, end], ...rangesAfter];
  }

  return [
    ...rangesBefore,
    [
      Math.min(start, rangesMiddle[0][0]),
      Math.max(end, rangesMiddle[rangesMiddle.length - 1][1]),
    ],
    ...rangesAfter,
  ];
}

export function removeRange(ranges: Range[], t: TupleArg): Range[] {
  const r2 = range(t);
  return ranges.flatMap((r1) => subsRanges(r1, r2));
}

function subsRanges(r1: Range, r2: Range): Range[] {
  if (r2[1] < r1[0] || r2[0] > r1[1]) {
    return [r1];
  }
  return (
    [
      [r1[0], r2[0] - 1],
      [r2[1] + 1, r1[1]],
    ] satisfies Range[]
  ).filter((r) => r[1] >= r[0]);
}
