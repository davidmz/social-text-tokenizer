import { Token } from './types';
import regexpTokeniser from './lib/byRegexp';
import { wordAdjacentChars } from './lib/chars';

export class ForeignMention extends Token {
  constructor(offset: number, text: string, public username: string, public service: string) {
    super(offset, text);
  }
}

const defaultRe = /([a-z0-9_-]+)@([a-z0-9]+)/gi;

const adjacentChars = new RegExp(`[${wordAdjacentChars}]`);

export const tokenize = (re = defaultRe) =>
  regexpTokeniser(re, (offset, text, match) => {
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
    return new ForeignMention(offset, text, match[1], match[2]);
  });
