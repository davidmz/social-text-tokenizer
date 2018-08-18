import { Tokenizer, Token } from './types';

/**
 * The simplest token represented plain text
 */
export class TextToken extends Token {}

/**
 * withText returns a tokenizer which adds TextTokens between
 * tokens produced by wrapped tokenizer.
 */
export default function withText(tokenizer: Tokenizer): Tokenizer {
  return function(text: string): Token[] {
    const result: Token[] = [];
    let pos = 0;
    for (const t of tokenizer(text)) {
      if (t.offset > pos) {
        result.push(new TextToken(pos, text.substring(pos, t.offset)));
      }
      result.push(t);
      pos = t.offset + t.text.length;
    }
    if (text.length > pos) {
      result.push(new TextToken(pos, text.substring(pos)));
    }
    return result;
  };
}
