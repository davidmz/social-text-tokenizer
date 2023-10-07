import { describe, expect, it } from 'vitest';

import { TEXT } from './token-types';
import { makeToken } from './utils';
import { withTexts } from './with-texts';

const wordToken = makeToken('word');
const textToken = makeToken(TEXT);

describe('createParser', () => {
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
});
