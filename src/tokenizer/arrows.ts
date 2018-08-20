import byRegexp from './byRegexp';
import { Token } from '../types';

export class Arrows extends Token {}

export const tokenize = byRegexp(
  /\u2191+|\^+/g,
  (offset: number, text: string, match: RegExpExecArray): Token | null => {
    if (
      text.charAt(0) === '\u2191' ||
      text.length > 1 ||
      offset === 0 ||
      offset === match.input.length - 1
    ) {
      return new Arrows(offset, text);
    }

    const prevChar = match.input.charAt(offset - 1);
    const nextChar = match.input.charAt(offset + text.length);

    if (/[WH]/.test(nextChar)) {
      return null;
    }

    const re = /[\s,.]/;

    return re.test(prevChar) || re.test(nextChar) ? new Arrows(offset, text) : null;
  }
);
