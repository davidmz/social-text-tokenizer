import { Token } from '../types';
import byWords from './byWords';

const re = /([a-zа-я0-9.&~!%_+-]+@(?:[a-zа-я0-9-]+\.)+[a-zа-я0-9-]+)/g;

export class EMail extends Token {}

export const tokenize = byWords(re, (offset, text) => new EMail(offset, text));
