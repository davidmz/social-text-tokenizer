import { describe, expect, it } from 'vitest';
import byWords from './byWords';
import { Token } from '../types';
import { makeToken } from './byRegexp';

class TestToken extends Token {}

describe('byWords', () => {
  it('should tokenize by words', () => {
    const tokenizer = byWords(/a+/g, makeToken(TestToken));
    expect(tokenizer('abcaabcda, aa! & @aaa «a»')).toEqual([
      new TestToken(11, 'aa'),
      new TestToken(23, 'a'),
    ]);
  });
});
