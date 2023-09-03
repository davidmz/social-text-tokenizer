import { withFilters } from '../filters';
import { ARROWS } from '../token-types';
import type { Token } from '../types';
import { Characters, makeToken, reTokenizer } from '../utils';

const defaultRe = /\u2191+|\^(?:[1-9]\d*|\^*)/g;

const validNearChars = new Characters(
  // \s-like characters
  0x0009,
  0x0020,
  0x00a0,
  0x000a,
  0x000d,
  // Also spaces
  [0x2000, 0x200a],
).withChars('.,');

export function arrows(re = defaultRe) {
  return withFilters(reTokenizer(re, makeToken(ARROWS)), withNearChars);
}

function withNearChars(token: Token, input: string) {
  if (
    token.text.charAt(0) === '\u2191' ||
    // Two or more ^
    (token.text.length > 1 &&
      token.text === token.text.charAt(0).repeat(token.text.length)) ||
    // At start of text
    token.offset === 0
  ) {
    return token;
  }

  const prevChar = input.charAt(token.offset - 1);
  const nextChar = input.charAt(token.offset + token.text.length);

  if (
    /[WH]/.test(nextChar) ||
    /\d/.test(prevChar) ||
    (!validNearChars.includesChar(prevChar) &&
      !validNearChars.includesChar(nextChar))
  ) {
    return null;
  }

  return token;
}
