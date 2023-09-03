import type { Token, Tokenizer } from '../types';

export type MatchProcessor = (
  offset: number,
  text: string,
  match: RegExpMatchArray,
) => Token | null;

export function reTokenizer(
  regex: RegExp,
  processMatch: MatchProcessor,
): Tokenizer {
  if (!regex.global) {
    throw new Error('RegExp must have a global flag!');
  }

  return (text: string) => {
    const result = [];
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const it = processMatch(match.index, match[0], match);
      it && result.push(it);
    }
    return result;
  };
}
