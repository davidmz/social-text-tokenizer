import type { Characters } from '../utils/characters';
import { wordAdjacentChars } from '../utils/chars';
import type { TokenFilter } from './filters';
import { combineFilters } from './filters';

export function withCharsBefore(
  chars: Characters,
  allowStartOfText = true,
): TokenFilter {
  return (token, text) => {
    const ch = text.charAt(token.offset - 1);
    return (allowStartOfText && !ch) || chars.includesChar(ch) ? token : null;
  };
}

export function withCharsAfter(
  chars: Characters,
  allowEndOfText = true,
): TokenFilter {
  return (token, text) => {
    const ch = text.charAt(token.offset + token.text.length);
    return (allowEndOfText && !ch) || chars.includesChar(ch) ? token : null;
  };
}

export const withWordBoundaries = combineFilters(
  withCharsBefore(wordAdjacentChars),
  withCharsAfter(wordAdjacentChars),
);
