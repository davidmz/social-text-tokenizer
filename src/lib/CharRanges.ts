export type TupleArg = number | [number, number];
export type SomeTuples = [TupleArg, ...TupleArg[]];
type Range = [number, number];

function range(t: TupleArg): Range {
  if (typeof t === 'number') {
    return [t, t];
  }
  return t[0] <= t[1] ? [t[0], t[1]] : [t[1], t[0]];
}

export default class CharRanges {
  ranges: Range[] = [];

  constructor(...tuples: TupleArg[]) {
    if (tuples.length > 0) {
      // See https://github.com/microsoft/TypeScript/issues/4130
      this.add(...(tuples as SomeTuples));
    }
  }

  add(...tuples: SomeTuples): this {
    this.ranges = [...this.ranges, ...tuples.map(range)];
    this.normalize();
    return this;
  }

  addChars(chars: string): this {
    if (chars.length > 0) {
      const charCodes = chars.split('').map((c) => c.charCodeAt(0)) as SomeTuples;
      this.add(...charCodes);
    }
    return this;
  }

  remove(...tuples: SomeTuples): this {
    this.ranges = diff(this.ranges, normalize(tuples.map(range)));
    return this;
  }

  removeChars(chars: string): this {
    if (chars.length > 0) {
      const charCodes = chars.split('').map((c) => c.charCodeAt(0)) as SomeTuples;
      this.remove(...charCodes);
    }
    return this;
  }

  toString(): string {
    return this.ranges
      .map(([start, end]) => (start === end ? uHex(start) : `${uHex(start)}-${uHex(end)}`))
      .join('');
  }

  clone(): CharRanges {
    const clone = new CharRanges();
    clone.ranges = this.ranges.slice();
    return clone;
  }

  private normalize() {
    this.ranges = normalize(this.ranges);
  }
}

function normalize(ranges: Range[]): Range[] {
  const sorted = ranges.slice().sort((a, b) => a[0] - b[0]); // Sort by start
  const result: Range[] = [];
  for (const curr of sorted) {
    if (result.length === 0) {
      result.push(curr);
      continue;
    }
    const prev = result[result.length - 1];
    if (curr[0] <= prev[1] + 1 && curr[1] > prev[1]) {
      result.pop();
      result.push([prev[0], curr[1]]);
    } else if (curr[0] > prev[1]) {
      result.push(curr);
    }
  }
  return result;
}

/**
 * Subsctract one ranges set from another.
 *
 * @param r1 ranges to subscract from (MUST be normalized)
 * @param r2 ranges to subscract (MUST be normalized)
 */
function diff(r1: Range[], r2: Range[]): Range[] {
  if (r1.length === 0 || r2.length === 0) {
    return r1.slice();
  }
  const result: Range[] = [];
  for (const src of r1) {
    const toSub = r2.filter((r) => r[0] <= src[1] && r[1] >= src[0]);
    let pos = src[0];
    for (const sub of toSub) {
      if (sub[0] - 1 >= pos) {
        result.push([pos, sub[0] - 1]);
      }
      pos = sub[1] + 1;
    }
    if (pos <= src[1]) {
      result.push([pos, src[1]]);
    }
  }
  return normalize(result);
}

function uHex(n: number): string {
  let h = n.toString(16);
  while (h.length < 4) {
    h = `0${h}`;
  }
  return `\\u${h}`;
}
