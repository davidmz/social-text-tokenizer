import { describe, expect, it } from 'vitest';

import { makeToken } from './make-token';
import { reTokenizer } from './re-tokenizer';
import { tableTest } from './test-helpers';

const tok = makeToken('test');
const tokenizer = reTokenizer(/a+/g, tok);

tableTest('reTokenizer', tokenizer, [
  ['abc', [tok(0, 'a')]],
  ['abaac', [tok(0, 'a'), tok(2, 'aa')]],
]);

describe('reTokenizer', () => {
  it('should throw on regexps matching empty strings', () => {
    const tokenizer = reTokenizer(/a*/g, tok);

    expect(() => tokenizer('bbb')).toThrow(
      'RegExp must not match empty strings!',
    );
  });
});
