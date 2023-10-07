import { combine } from './combine';
import { TEXT } from './token-types';
import type { Tokenizer } from './types';
import { makeToken } from './utils';

const textToken = makeToken(TEXT);

export function withTexts(...tokenizers: Tokenizer[]): Tokenizer {
  const tokenizer = combine(...tokenizers);
  return (input) => {
    const result = [];
    let pos = 0;
    for (const t of tokenizer(input)) {
      if (t.offset > pos) {
        result.push(textToken(pos, input.slice(pos, t.offset)));
      }

      result.push(t);
      pos = t.offset + t.text.length;
    }
    if (input.length > pos) {
      result.push(textToken(pos, input.slice(pos)));
    }
    return result;
  };
}
