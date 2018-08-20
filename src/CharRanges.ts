type Range = [number, number];

function range(start: number, end: number = start): Range {
  return start <= end ? [start, end] : [end, start];
}

export default class CharRanges {
  ranges: Range[] = [];

  add(...tuples: ([number, number] | number)[]): this {
    const ranges = tuples.map((t) => (typeof t === 'number' ? range(t) : range(t[0], t[1])));
    this.ranges = [...this.ranges, ...ranges];
    this.normalize();
    return this;
  }

  addChars(chars: string): this {
    const charCodes = chars.split('').map((c) => c.charCodeAt(0));
    this.add(...charCodes);
    return this;
  }

  remove(...tuples: ([number, number] | number)[]): this {
    const ranges = tuples.map((t) => (typeof t === 'number' ? range(t) : range(t[0], t[1])));
    this.ranges = diff(this.ranges, normalize(ranges));
    return this;
  }

  removeChars(chars: string): this {
    const charCodes = chars.split('').map((c) => c.charCodeAt(0));
    this.remove(...charCodes);
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
