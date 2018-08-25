import { Token } from './types';
import byWords from './lib/byWords';
import { makeToken } from './lib/byRegexp';

const re = /@([a-z0-9]+(?:-[a-z0-9]+)*)/g;

export class Mention extends Token {}

export const tokenize = byWords(re, makeToken(Mention));
