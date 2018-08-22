import { toUnicode } from 'punycode';

import { Token } from '../types';
import byWords from './byWords';
import { makeToken } from './byRegexp';

const re = /([a-zа-я0-9.&~!%_+-]+@(?:[a-zа-я0-9-]+\.)+[a-zа-я0-9-]+)/g;

export class Email extends Token {
  get pretty(): string {
    return toUnicode(this.text);
  }
}

export const tokenize = byWords(re, makeToken(Email));
