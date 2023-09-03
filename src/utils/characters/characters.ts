import { addRange, removeRange } from './ranges';
import type { Range, SomeTuples, TupleArg } from './types';

export class Characters {
  private readonly ranges: Range[] = [];

  constructor(chars: string);
  constructor(...tuples: TupleArg[]);
  constructor(...args: unknown[]) {
    let codes: TupleArg[];
    if (args.length === 1 && typeof args[0] === 'string') {
      codes = strToCodes(args[0]);
    } else {
      codes = args as TupleArg[];
    }
    for (const t of codes) {
      this.ranges = addRange(this.ranges, t);
    }
  }

  withCodes(...tuples: SomeTuples): Characters {
    return new Characters(...this.ranges, ...tuples);
  }

  withChars(chars: string): Characters {
    if (chars.length > 0) {
      const charCodes = strToCodes(chars) as SomeTuples;
      return this.withCodes(...charCodes);
    }
    return this;
  }

  withoutCodes(...tuples: SomeTuples): Characters {
    let ranges = this.ranges;
    for (const t of tuples) {
      ranges = removeRange(ranges, t);
    }
    return new Characters(...ranges);
  }

  withoutChars(chars: string): Characters {
    if (chars.length > 0) {
      const charCodes = strToCodes(chars) as SomeTuples;
      return this.withoutCodes(...charCodes);
    }
    return this;
  }

  includesCode(code: number): boolean {
    return this.ranges.some((r) => r[0] <= code && r[1] >= code);
  }

  includesChar(ch: string): boolean {
    return this.includesCode(ch.charCodeAt(0));
  }

  toString(): string {
    return this.ranges
      .map(([start, end]) =>
        start === end ? uHex(start) : `${uHex(start)}-${uHex(end)}`,
      )
      .join('');
  }
}

function uHex(n: number): string {
  let h = n.toString(16);
  while (h.length < 4) {
    h = `0${h}`;
  }
  return `\\u${h}`;
}

function strToCodes(str: string): number[] {
  const res = [];
  for (let i = 0, l = str.length; i < l; i++) {
    res.push(str.charCodeAt(i));
  }
  return res;
}
