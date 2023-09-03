import type { Token, Tokenizer } from '../types';
import { truthy } from '../utils/truthy';

export type TokenFilter = (token: Token, input: string) => Token | null;

/**
 * Returns tokenizer with applied filters (from left to right).
 */
export function withFilters(
  tokenizer: Tokenizer,
  ...filters: TokenFilter[]
): Tokenizer {
  const filter = combineFilters(...filters);
  return (text) =>
    tokenizer(text)
      .map((t) => filter(t, text))
      .filter(truthy);
}

/**
 * Combine several filters to one. Filters applies from left to right.
 */
export function combineFilters(...filters: TokenFilter[]): TokenFilter {
  return (token, input) => {
    for (const filter of filters) {
      const t1 = filter(token, input);
      if (!t1) {
        return null;
      }
      token = t1;
    }
    return token;
  };
}
