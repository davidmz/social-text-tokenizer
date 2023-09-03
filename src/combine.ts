import type { Tokenizer } from './types';

/**
 * Combine combines several tokenizers into one. It leaves only non-overlapping
 * tokens, and in case of conflict leaves the token that starts earlier or has
 * longer text.
 *
 * It always returns properly ordered and non-overlapped tokens.
 */
export function combine(...tokenizers: Tokenizer[]): Tokenizer {
  return (text) => {
    const allTokens = tokenizers
      .flatMap((t) => t(text))
      .sort((a, b) => a.offset - b.offset);
    if (allTokens.length === 0) {
      return allTokens;
    }

    let last = allTokens.shift()!;
    const result = [last];
    for (const token of allTokens) {
      // If token starts at the same offset, but has longer text, use it instead
      // of last token
      if (
        token.offset === last.offset &&
        token.text.length > last.text.length
      ) {
        last = token;
        result.splice(-1, 1, token);
      }
      // If token starts after (or at) the last token end, append it
      else if (token.offset >= last.offset + last.text.length) {
        last = token;
        result.push(token);
      }
      // Otherwise just skip this token (starts inside the last one, or has
      // shorter text)
    }
    return result;
  };
}
