import CharRanges from '../CharRanges';
import { Token } from '../types';
import byWords from './byWords';

const invalidChars = new CharRanges().add(
  [0x0000, 0x0020],
  0x007f,
  [0x0080, 0x00a0],
  [0x0021, 0x002f],
  [0x003a, 0x0040],
  [0x005b, 0x0060],
  [0x007b, 0x007e],
  [0x00a1, 0x00bf],
  0x00d7,
  0x00f7,
  [0x2000, 0x206f]
);

const re = new RegExp(`#([^${invalidChars}]+(?:[_-][^${invalidChars}]+)*)`, 'g');

export class HashTag extends Token {}

export const tokenize = byWords(re, (offset, text) => new HashTag(offset, text));
