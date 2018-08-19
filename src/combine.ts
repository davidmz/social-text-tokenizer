import { Tokenizer, Token } from './types';

/**
 * combine combines multiple tokenizer into one
 */
export default function combine(...tokenizers: Tokenizer[]): Tokenizer {
  if (tokenizers.length === 0) {
    return () => [];
  } else if (tokenizers.length === 1) {
    return tokenizers[0];
  }
  return function(text: string): Token[] {
    const allFounds = tokenizers.map((f) => f(text));
    let position = 0;
    const result: Token[] = [];
    while (true) {
      const tokens = allFounds
        .map((founds) => founds.find(({ offset }) => offset >= position))
        .filter((found) => !!found && !result.find((t) => t.offset === found.offset)) as Token[];
      if (tokens.length === 0) {
        break;
      }

      const firstItem = tokens.reduce(
        (first, it) =>
          first.offset < it.offset || // first by offset
          (first.offset === it.offset && first.text.length >= it.text.length) // or has a longer length
            ? first
            : it
      );
      result.push(firstItem);
      position = firstItem.offset + firstItem.text.length;
    }
    return result;
  };
}
