import { Token } from '../types';
import byWords from './byWords';
import { makeToken } from './byRegexp';

const re = /@([a-z0-9]+(?:-[a-z0-9]+)*)/g;

export class Mention extends Token {}

export const tokenize = byWords(re, makeToken(Mention));
