import { withCharsBefore, withFilters } from '../filters';
import { MENTION } from '../token-types';
import type { Token } from '../types';
import { makeToken, reTokenizer, wordAdjacentChars } from '../utils';

const defaultRe = /@([a-z0-9]+(?:-[a-z0-9]+)*)/gi;

export function mentions(re = defaultRe) {
  return withFilters(
    reTokenizer(re, makeToken(MENTION)),
    withCharsBefore(wordAdjacentChars),
    withProperCharsAfter,
  );
}

export function withProperCharsAfter(token: Token, input: string) {
  const textAfter = input.slice(token.offset + token.text.length);
  // Allow textAfter to start with '-' with the following non-adjanced
  // characters. It is useful for russian @username-ных endings.
  if (textAfter.length >= 2 && textAfter.charAt(0) === '-') {
    if (wordAdjacentChars.includesChar(textAfter.charAt(1))) {
      return null;
    }
  } else if (textAfter.length >= 2 && textAfter.charAt(0) === '.') {
    // Disallow word char after dot to exclude '@domain.com' match
    if (!wordAdjacentChars.includesChar(textAfter.charAt(1))) {
      return null;
    }
  } else if (
    textAfter !== '' &&
    !wordAdjacentChars.includesChar(textAfter.charAt(0))
  ) {
    return null;
  }
  return token;
}
