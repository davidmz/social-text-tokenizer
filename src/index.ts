import { Tokenizer } from './types';
import withText from './withText';
import combine from './combine';

export default function tokenizer(...tokenizers: Tokenizer[]): Tokenizer {
  return withText(combine(...tokenizers));
}

export { default as combine } from './combine';

export { HashTag, tokenize as hashTags } from './tokenizer/hashtags';
export { EMail, tokenize as emails } from './tokenizer/emails';
export { Mention, tokenize as mentions } from './tokenizer/mentions';
