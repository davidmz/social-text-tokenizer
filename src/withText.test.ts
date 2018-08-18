import withText, { TextToken } from './withText';
import { Token } from './types';
import byWords from './tokenizer/byWords';

class WordToken extends Token {}

describe('withText', () => {
  const tokenize = byWords(/a+/g, (offset, text) => new WordToken(offset, text));
  const parse = withText(tokenize);

  it('should return text tokens between words', () => {
    expect(parse(' aa,bb aaa!?')).toEqual([
      new TextToken(0, ' '),
      new WordToken(1, 'aa'),
      new TextToken(3, ',bb '),
      new WordToken(7, 'aaa'),
      new TextToken(10, '!?'),
    ]);
  });
});
