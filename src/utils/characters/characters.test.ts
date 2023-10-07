import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';

import { Characters } from './characters';

describe('Characters', () => {
  it('should return string representation of ranges', () => {
    const ch = new Characters([1, 5], 7, [9, 10]);
    expect(ch.toString()).toBe('\\u0001-\\u0005\\u0007\\u0009-\\u000a');
  });

  it('should add characters', () => {
    const ch = new Characters('ab').withChars('cd');

    expect(ch.includesChar('a')).toBe(true);
    expect(ch.includesChar('c')).toBe(true);
    expect(ch.includesChar('e')).toBe(false);
  });

  it('should remove characters', () => {
    const ch = new Characters('abcd').withoutChars('def');

    expect(ch.includesChar('a')).toBe(true);
    expect(ch.includesChar('d')).toBe(false);
    expect(ch.includesChar('e')).toBe(false);
  });
});
