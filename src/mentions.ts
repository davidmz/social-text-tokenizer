import { Token } from './types';
import byWords from './lib/byWords';
import { makeToken } from './lib/byRegexp';

const defaultRe = /@([a-z0-9]+(?:-[a-z0-9]+)*)/gi;

export class Mention extends Token {}

export const tokenize = (re = defaultRe) => byWords(re, makeToken(Mention));
