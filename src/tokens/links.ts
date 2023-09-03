import escapeRegExp from 'lodash.escaperegexp';

import { combine } from '../combine';
import type { TokenFilter } from '../filters';
import { withCharsAfter, withCharsBefore, withFilters } from '../filters';
import { LINK } from '../token-types';
import type { Token } from '../types';
import {
  Characters,
  makeToken,
  reTokenizer,
  wordAdjacentChars,
} from '../utils';

const defaultTLDList = ['рф', 'com', 'net', 'org', 'edu'];

export type LinkTokenizerParams = {
  tldList?: string[];
  tldRe?: string;
};

export function links({
  tldList = defaultTLDList,
  tldRe = ['xn--[a-z0-9]+', ...tldList.map(escapeRegExp), '[a-z]{2}'].join('|'),
}: LinkTokenizerParams = {}) {
  const regexps = [
    // Something starts with URL schema
    `(https?|ftp)://[^\\s<>]+`,
    // Something starts with www.
    `www\\.[^\\s<>]+`,
    // Something starts with domain-like pattern
    `(?:[a-zа-я0-9][a-zа-я0-9-]*\\.)+(?:${tldRe})(?::\\d+)?(?:/[^\\s<>]*)?`,
  ];
  return combine(...regexps.map((re) => linksTokenizer(re)));
}

function linksTokenizer(reString: string) {
  return withFilters(
    reTokenizer(new RegExp(reString, 'gi'), makeToken(LINK)),
    withCharsBefore(wordAdjacentChars.withoutChars('./')),
    withBalancedTile,
    // Token text should still satisfy regexp
    withRegexpSatisfied(new RegExp(`^${reString}$`, 'i')),
    withCharsAfter(wordAdjacentChars),
  );
}

function withRegexpSatisfied(re: RegExp): TokenFilter {
  return (token) => (re.test(token.text) ? token : null);
}

function withBalancedTile(token: Token) {
  // Final punctuation?
  const m = finalPunctsRe.exec(token.text);
  if (m === null) {
    // No punctuation at the end of link, returning token as is
    return token;
  }

  let tail = m[0]; // Consists of punctuation characters
  const head = token.text.slice(0, -tail.length);

  if (isBalanced(head) || !anyClosingBracketsRe.test(tail)) {
    // No closing brackets in tail or head is balanced, so just cut the tail
    // off.
    return { ...token, text: head };
  }

  // Trim non-brackets
  tail = tail.replace(finalNonBracketsRe, '');
  // Add one by one character to head, until balance reached
  let text = head;
  for (let i = 0; i < tail.length && !isBalanced(text); i++) {
    text += tail[i];
  }

  return { ...token, text };
}

// Base latin punctuation excluding '/', '-', '_', '+', '#', '&', '*', including ellipsis and quotes
const finalPuncts = new Characters(
  [0x20, 0x2f], // ASCII punctuation
  [0x3a, 0x40], // ASCII punctuation
  [0x5b, 0x60], // ASCII punctuation
  [0x7b, 0x7e], // ASCII punctuation
  [0xa0, 0xbf], // Latin-1 punctuation and symbols
  [0x2018, 0x201f],
  0x2026, // HORIZONTAL ELLIPSIS
).withoutChars('/-_+#&*');

const finalPunctsRe = new RegExp(`[${finalPuncts}]+$`);

// Brackets balance

const openingBrackets = ['(', '[', '{', '\u00AB'];
const closingBrackets = [')', ']', '}', '\u00BB'];
const nonPairedQuotes = ['"', "'"];

const anyClosingBracketsRe = new RegExp(
  `[${escapeRegExp([...closingBrackets, ...nonPairedQuotes].join(''))}]`,
);
const finalNonBracketsRe = new RegExp(
  `[^${escapeRegExp(
    [...openingBrackets, ...closingBrackets, ...nonPairedQuotes].join(''),
  )}]+$`,
);

function isBalanced(text: string): boolean {
  const balances = {} as { [key: string]: number };

  for (const c of text.split('')) {
    const openedPos = openingBrackets.indexOf(c);
    const closedPos = closingBrackets.indexOf(c);
    const quotesPos = nonPairedQuotes.indexOf(c);
    if (openedPos >= 0) {
      balances[`b${openedPos}`] = (balances[`b${openedPos}`] || 0) + 1;
    }
    if (closedPos >= 0) {
      balances[`b${closedPos}`] = (balances[`b${closedPos}`] || 0) - 1;
    }
    if (quotesPos >= 0) {
      balances[`q${quotesPos}`] = 1 - (balances[`q${quotesPos}`] || 0);
    }
  }

  return !Object.values(balances).some((v) => v !== 0);
}
