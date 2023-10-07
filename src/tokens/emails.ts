import { EMAIL } from '../';
import { withFilters, withWordBoundaries } from '../filters';
import { makeToken, reTokenizer } from '../utils';

const defaultRe = /([a-zа-я0-9.&~!%_+-]+@(?:[a-zа-я0-9-]+\.)+[a-zа-я0-9-]+)/gi;

export function emails(re = defaultRe) {
  return withFilters(reTokenizer(re, makeToken(EMAIL)), withWordBoundaries);
}
