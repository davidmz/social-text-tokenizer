import { Token } from './types';
import byRegexp from './lib/byRegexp';
import { makeToken } from './lib/byRegexp';

const defaultRe = /<spoiler>(?:(?!(<spoiler>|<\/spoiler>)).)*<\/spoiler>/gi;

export class Spoiler extends Token {}

export const tokenize = (re = defaultRe) => byRegexp(re, makeToken(Spoiler));
