import type { Token } from '../types';

export function makeToken(
  type: string,
): (offset: number, text: string) => Token {
  return (offset: number, text: string) => ({ type, offset, text });
}
