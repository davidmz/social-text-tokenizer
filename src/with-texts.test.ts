import { describe, expect, it } from 'vitest';

import { TEXT } from './token-types';
import type { Token } from './types';
import { makeToken } from './utils';
import { withTexts } from './with-texts';

const wordToken = makeToken('word');
const textToken = makeToken(TEXT);

function expectContinuousCoverage(tokens: Token[], input: string) {
  let pos = 0;

  for (const token of tokens) {
    expect(token.offset).toBe(pos);
    pos += token.text.length;
  }

  expect(pos).toBe(input.length);
  expect(tokens.map((token) => token.text).join('')).toBe(input);
}

describe('withTexts', () => {
  const parse = withTexts(() => [wordToken(1, 'aa'), wordToken(7, 'aaa')]);

  it('should return text tokens between words', () => {
    expect(parse(' aa,bb aaa!?')).toEqual([
      textToken(0, ' '),
      wordToken(1, 'aa'),
      textToken(3, ',bb '),
      wordToken(7, 'aaa'),
      textToken(10, '!?'),
    ]);
  });

  it('should return a single text token when no tokens are found', () => {
    expect(withTexts(() => [])('plain text')).toEqual([
      textToken(0, 'plain text'),
    ]);
  });

  it('should return an empty array for an empty input', () => {
    expect(withTexts(() => [])('')).toEqual([]);
  });

  it('should not add text tokens when tokens already cover the whole input', () => {
    const parse = withTexts(() => [wordToken(0, 'ab'), wordToken(2, 'cd')]);

    expect(parse('abcd')).toEqual([wordToken(0, 'ab'), wordToken(2, 'cd')]);
  });

  it('should produce tokens continuously covering the whole input', () => {
    const input = ' aa,bb aaa!?';
    const tokens = parse(input);

    expectContinuousCoverage(tokens, input);
  });
});
