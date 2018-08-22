import { Tokenizer } from './types';
import withText from './withText';
import combine from './combine';

export default function createTokenizer(...tokenizers: Tokenizer[]): Tokenizer {
  return withText(combine(...tokenizers));
}

export { default as combine } from './combine';

export { Text } from './withText';
export { HashTag, tokenize as hashTags } from './tokenizer/hashtags';
export { Email, tokenize as emails } from './tokenizer/emails';
export { Mention, tokenize as mentions } from './tokenizer/mentions';
export { Link, tokenize as links } from './tokenizer/links';
export { Arrows, tokenize as arrows } from './tokenizer/arrows';
