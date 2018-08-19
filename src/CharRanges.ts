export class Range {
  readonly start: number;
  readonly end: number;

  constructor(start: number, end: number = start) {
    if (start <= end) {
      [this.start, this.end] = [start, end];
    } else {
      [this.start, this.end] = [end, start];
    }
  }

  toTuple(): [number, number] {
    return [this.start, this.end];
  }

  toString(): string {
    if (this.start === this.end) {
      return uHex(this.start);
    }
    return `${uHex(this.start)}-${uHex(this.end)}`;
  }
}

export default class CharRanges {
  ranges: Range[] = [];

  add(...tuples: ([number, number] | number)[]) {
    for (const t of tuples) {
      if (typeof t === 'number') {
        this.addRange(new Range(t));
      } else {
        this.addRange(new Range(t[0], t[1]));
      }
    }
    return this;
  }

  remove(...tuples: ([number, number] | number)[]) {
    for (const t of tuples) {
      if (typeof t === 'number') {
        this.removeRange(new Range(t));
      } else {
        this.removeRange(new Range(t[0], t[1]));
      }
    }
    return this;
  }

  addChars(chars: string): this {
    for (let i = 0; i < chars.length; i++) {
      this.add(chars.charCodeAt(i));
    }
    return this;
  }

  removeChars(chars: string): this {
    for (let i = 0; i < chars.length; i++) {
      this.remove(chars.charCodeAt(i));
    }
    return this;
  }

  toString(): string {
    return this.ranges.map((r) => r.toString()).join('');
  }

  toTuples() {
    return this.ranges.map((r) => r.toTuple());
  }

  clone(): CharRanges {
    const clone = new CharRanges();
    clone.ranges = [...this.ranges];
    return clone;
  }

  ////////////////////

  private addRange(r: Range) {
    this.ranges.push(r);
    this.compact();
  }

  private removeRange(rem: Range) {
    const result: Range[] = [];
    for (const r of this.ranges) {
      if (rem.start <= r.start && rem.end >= r.end) {
        // noop
      } else if (rem.start > r.end || rem.end < r.start) {
        result.push(r);
      } else if (rem.start > r.start && rem.end >= r.end) {
        result.push(new Range(r.start, rem.start - 1));
      } else if (rem.start <= r.start && rem.end < r.end) {
        result.push(new Range(rem.end + 1, r.end));
      } else if (rem.start > r.start && rem.end < r.end) {
        result.push(new Range(r.start, rem.start - 1), new Range(rem.end + 1, r.end));
      }
    }
    this.ranges = result;
  }

  private compact() {
    const result: Range[] = [];
    const sortedRanges = this.ranges.sort((a, b) => a.start - b.start); // Sort by start
    for (const curr of sortedRanges) {
      if (result.length === 0) {
        result.push(curr);
        continue;
      }
      const prev = result[result.length - 1];
      if (curr.start <= prev.end + 1 && curr.end > prev.end) {
        result.pop();
        result.push(new Range(prev.start, curr.end));
      } else if (curr.start > prev.end) {
        result.push(curr);
      }
    }
    this.ranges = result;
  }
}

function uHex(n: number): string {
  let h = n.toString(16);
  while (h.length < 4) {
    h = `0${h}`;
  }
  return `\\u${h}`;
}
