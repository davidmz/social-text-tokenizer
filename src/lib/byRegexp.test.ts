import byRegexp, { makeToken } from './byRegexp';
import { Token } from '../types';

class TestToken extends Token {}

describe('byRegexp', () => {
  it('should tokenize by regexp', () => {
    const tokenizer = byRegexp(/a+/g, makeToken(TestToken));
    expect(tokenizer('abcaabcda')).toEqual([
      new TestToken(0, 'a'),
      new TestToken(3, 'aa'),
      new TestToken(8, 'a'),
    ]);
  });

  it('should skip nulls', () => {
    const tokenizer = byRegexp(/a+/g, (offset, text) => {
      if (text.length > 1) {
        return null;
      }
      return new TestToken(offset, text);
    });
    expect(tokenizer('abcaabcda')).toEqual([new TestToken(0, 'a'), new TestToken(8, 'a')]);
  });

  it('should not accept non-global regexp', () => {
    expect(() => {
      byRegexp(/a+/, makeToken(TestToken));
    }).toThrow('RegExp must have a global flag!');
  });
});
