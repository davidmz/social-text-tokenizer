import { Token } from './types';
import regexpTokeniser from './lib/byRegexp';
import { makeToken } from './lib/byRegexp';
import { wordAdjacentChars } from './lib/chars';

const defaultRe = /@([a-z0-9]+(?:-[a-z0-9]+)*)/gi;

const adjacentChars = new RegExp(`[${wordAdjacentChars}]`);

export class Mention extends Token { }

const tokenMaker = makeToken(Mention);

export const tokenize = (re = defaultRe) => regexpTokeniser(re, (offset, text, match) => {
  const charBefore = match.input.charAt(offset - 1);
  const textAfter = match.input.substring(offset + text.length);
  if (charBefore !== '' && !adjacentChars.test(charBefore)) {
    return null;
  }
  // Allow textAfter to start with '-' with the following non-adjanced
  // characters. It is useful for russian @username-ных endings.
  if (textAfter.length >= 2 && textAfter.charAt(0) === '-') {
    if (adjacentChars.test(textAfter.charAt(1))) {
      return null;
    }
  } else if (textAfter !== '' && !adjacentChars.test(textAfter.charAt(0))) {
    return null;
  }
  return tokenMaker(offset, text, match);
});