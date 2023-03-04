import { describe, expect, it } from 'vitest';
import withText, { Text } from './withText';
import { Token } from '../types';
import byWords from './byWords';
import { makeToken } from './byRegexp';

class Word extends Token {}

describe('withText', () => {
  const tokenize = byWords(/a+/g, makeToken(Word));
  const parse = withText(tokenize);

  it('should return text tokens between words', () => {
    expect(parse(' aa,bb aaa!?')).toEqual([
      new Text(0, ' '),
      new Word(1, 'aa'),
      new Text(3, ',bb '),
      new Word(7, 'aaa'),
      new Text(10, '!?'),
    ]);
  });
});
