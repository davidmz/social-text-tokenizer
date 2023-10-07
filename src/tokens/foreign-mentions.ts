import { withCharsBefore, withFilters } from '../filters';
import { FOREIGN_MENTION } from '../token-types';
import { withProperCharsAfter } from '../tokens/mentions';
import { makeToken, reTokenizer, wordAdjacentChars } from '../utils';

const defaultRe = /([a-z0-9_-]+)@([a-z0-9]+)/gi;

export function foreignMentions(re = defaultRe) {
  return withFilters(
    reTokenizer(re, makeToken(FOREIGN_MENTION)),
    withCharsBefore(wordAdjacentChars),
    withProperCharsAfter,
  );
}
