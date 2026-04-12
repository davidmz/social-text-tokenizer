import type { Token, Tokenizer } from './types';

/**
 * Combine combines several tokenizers into one. It leaves only non-overlapping
 * tokens.
 *
 * In case of conflict, it prefers the token that starts earlier. For tokens
 * with the same offset, it prefers the longer one. If both offset and length
 * are the same, the first token wins.
 *
 * It always returns properly ordered and non-overlapped tokens.
 */
export function combine(...tokenizers: Tokenizer[]): Tokenizer {
  return (text) => {
    const allTokens = tokenizers
      .flatMap((t) => t(text))
      .sort((a, b) => a.offset - b.offset || b.text.length - a.text.length);
    if (allTokens.length === 0) {
      return allTokens;
    }

    let last: Token | null = null;
    const result: Token[] = [];
    for (const token of allTokens) {
      // If token starts after (or at) the last token end, append it
      if (!last || token.offset >= last.offset + last.text.length) {
        last = token;
        result.push(token);
      }
      // Otherwise just skip this token (starts inside the last one, or loses
      // to an earlier/longer token with the same offset)
    }
    return result;
  };
}
