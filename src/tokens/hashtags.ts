import { withFilters, withWordBoundaries } from '../filters';
import { HASHTAG } from '../token-types';
import { Characters, makeToken, reTokenizer } from '../utils';

const invalidChars = new Characters(
  [0x0000, 0x0020], // Non-printable
  0x007f, // Non-printable
  [0x0080, 0x00a0], // Non-printable
  [0x0021, 0x002f], // Space and punctuation
  [0x003a, 0x0040], // Punctuation
  [0x005b, 0x0060], // Punctuation
  [0x007b, 0x007e], // Punctuation
  [0x00a1, 0x00bf],
  0x00d7,
  0x00f7,
  [0x2000, 0x206f],
);

const defaultRe = new RegExp(
  `#([^${invalidChars}]+(?:[_-][^${invalidChars}]+)*)`,
  'g',
);

export function hashtags(re = defaultRe) {
  return withFilters(reTokenizer(re, makeToken(HASHTAG)), withWordBoundaries);
}
