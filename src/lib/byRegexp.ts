import { Token, Tokenizer } from '../types';

export type MatchProcessor = (offset: number, text: string, m: RegExpExecArray) => Token | null;

export default function byRegexp(regex: RegExp, processMatch: MatchProcessor): Tokenizer {
  if (!regex.global) {
    throw new Error('RegExp must have a global flag!');
  }
  return function (text: string): Token[] {
    regex.lastIndex = 0;
    const founds: Token[] = [];
    while (true) {
      const match = regex.exec(text);
      if (match === null) {
        break;
      }
      const it = processMatch(match.index, match[0], match);
      it && founds.push(it);
    }
    return founds;
  };
}

export function makeToken(Constr: new (offset: number, text: string) => Token): MatchProcessor {
  return (offset: number, text: string) => new Constr(offset, text);
}
