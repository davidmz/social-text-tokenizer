import { toUnicode } from 'punycode';

import { Token, Prettifier } from './types';
import byWords from './lib/byWords';
import { makeToken } from './lib/byRegexp';

const re = /([a-zа-я0-9.&~!%_+-]+@(?:[a-zа-я0-9-]+\.)+[a-zа-я0-9-]+)/g;

export class Email extends Token implements Prettifier {
  get pretty(): string {
    return toUnicode(this.text);
  }
}

export const tokenize = byWords(re, makeToken(Email));
