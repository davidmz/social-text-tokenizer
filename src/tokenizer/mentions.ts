import { Token } from '../types';
import byWords from './byWords';

const re = /@([a-z0-9]+(?:-[a-z0-9]+)*)/g;

export class Mention extends Token {}

export const tokenize = byWords(re, (offset, text) => new Mention(offset, text));
