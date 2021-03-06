import byRegexp from './lib/byRegexp';
import { Token } from './types';

export class Arrows extends Token {}

export const tokenize = (re = /\u2191+|\^+/g) =>
  byRegexp(re, (offset: number, text: string, match: RegExpExecArray): Token | null => {
    if (
      text.charAt(0) === '\u2191' ||
      (text.length > 1 && text === text.charAt(0).repeat(text.length)) ||
      offset === 0 ||
      offset === match.input.length - 1
    ) {
      return new Arrows(offset, text);
    }

    const prevChar = match.input.charAt(offset - 1);
    const nextChar = match.input.charAt(offset + text.length);

    if (/[WH]/.test(nextChar) || /\d/.test(prevChar)) {
      return null;
    }

    const re = /[\s,.]/;

    return re.test(prevChar) || re.test(nextChar) ? new Arrows(offset, text) : null;
  });
