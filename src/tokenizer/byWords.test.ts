import byWords from './byWords';
import { Token } from '../types';

class TestToken extends Token {}

describe('byWords', () => {
  it('should tokenize by words', () => {
    const tokenizer = byWords(/a+/g, (offset, text) => new TestToken(offset, text));
    expect(tokenizer('abcaabcda, aa! & @aaa «a»')).toEqual([
      new TestToken(11, 'aa'),
      new TestToken(23, 'a'),
    ]);
  });
});
