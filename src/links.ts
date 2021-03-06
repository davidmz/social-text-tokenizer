import { toUnicode } from 'punycode';
import escapeRegExp from 'lodash.escaperegexp';

import { Token, Tokenizer, Prettifier } from './types';
import CharRanges from './lib/CharRanges';
import { wordAdjacentChars } from './lib/chars';
import byRegexp from './lib/byRegexp';
import combine from './lib/combine';

export class Link extends Token implements Prettifier {
  get href(): string {
    let href = this.text;
    if (!/^(https?|ftp):\/\//i.test(this.text)) {
      href = `http://${href}`;
    }
    if (/^\w+:\/\/[^\/]+$/i.test(href)) {
      href += '/';
    }
    return href;
  }

  get pretty(): string {
    let pretty = this.text.replace(/^(https?|ftp):\/\//i, '');
    if (/^[^\/]+\/$/i.test(pretty)) {
      pretty = pretty.substr(0, pretty.length - 1);
    }
    try {
      pretty = decodeURIComponent(pretty);
    } catch (e) {}

    const m = /^([^\/]+)([^]*)/.exec(pretty);
    if (m) {
      pretty = toUnicode(m[1]) + m[2];
    }

    return pretty;
  }

  /**
   * Shorten pretty-form of URL
   * @param limit maximum length of result
   */
  shorten(limit: number): string {
    let m;
    m = /^([^\/]+)(.+)/i.exec(this.pretty);
    if (!m) {
      return this.pretty;
    }
    const [host, tail] = [m[1], m[2]];

    const parts = [];
    const re = /[\/?&#_-]/g;
    let prevPos = -1;
    while ((m = re.exec(tail)) !== null) {
      parts.push(tail.substring(prevPos + 1, m.index + 1));
      prevPos = m.index;
    }
    if (prevPos < tail.length - 1) {
      parts.push(tail.substring(prevPos + 1));
    }

    let s = host;
    for (const part of parts) {
      if ((s + part).length > limit - 1) {
        return s == host ? s + '/\u2026' : s + '\u2026';
      }
      s += part;
    }
    return s;
  }
}

export const defaultTLDList = ['рф', 'com', 'net', 'org', 'edu'];

export type TokenizeParams = {
  tldList?: string[];
  tldRe?: string;
};

export function tokenize({
  tldList = defaultTLDList,
  tldRe = ['xn--[a-z0-9]+', ...tldList.map(escapeRegExp), '[a-z]{2}'].join('|'),
}: TokenizeParams = {}) {
  return combine(
    makeTokenizer(/(https?|ftp):\/\/[^\s<>]+/gi), // url with schema
    makeTokenizer(/www\.[^\s<>]+/gi), // started by www.
    makeTokenizer(
      new RegExp(`(?:[a-zа-я0-9][a-zа-я0-9-]*\\.)+(?:${tldRe})(?::\\d+)?(?:/[^\\s<>]*)?`, 'gi')
    ) // url-like pattern
  );
}

// Base latin punctuation excluding '/', '-', '_', '+', '#', '&', '*', including ellipsis and quotes
const finalPuncts = new CharRanges(
  [0x20, 0x2f], // ASCII punctuation
  [0x3a, 0x40], // ASCII punctuation
  [0x5b, 0x60], // ASCII punctuation
  [0x7b, 0x7e], // ASCII punctuation
  [0xa0, 0xbf], // Latin-1 punctuation and symbols
  [0x2018, 0x201f],
  0x2026 // HORIZONTAL ELLIPSIS
).removeChars('/-_+#&*');

const wordAdjacentCharsRe = new RegExp(`[${wordAdjacentChars}]`);
const finalPunctsRe = new RegExp(`[${finalPuncts}]+$`);
const validBeforeCharsRe = new RegExp(`[${wordAdjacentChars.clone().removeChars('./')}]`);

const openingBrackets = ['(', '[', '{', '\u00AB'];
const closingBrackets = [')', ']', '}', '\u00BB'];
const nonPairedQuotes = ['"', "'"];

const anyClosingBracketsRe = new RegExp(
  `[${escapeRegExp([...closingBrackets, ...nonPairedQuotes].join(''))}]`
);
const finalNonBracketsRe = new RegExp(
  `[^${escapeRegExp([...openingBrackets, ...closingBrackets, ...nonPairedQuotes].join(''))}]+$`
);

function makeTokenizer(regexp: RegExp): Tokenizer {
  return byRegexp(regexp, (offset, text, match) => {
    const charBefore = match.input.charAt(offset - 1);
    if (charBefore !== '' && !validBeforeCharsRe.test(charBefore)) {
      return null;
    }

    // Final punctuation?
    let m = finalPunctsRe.exec(text);
    if (m === null) {
      return linkIfCorrect(regexp, text, match);
    }

    let tail = m[0];
    const head = text.substr(0, text.length - tail.length);

    const headBalanced = isBalanced(head);
    if (headBalanced || !anyClosingBracketsRe.test(tail)) {
      // No closing brackets in tail or head is balanced, so just cut the tail
      // off.
      return linkIfCorrect(regexp, head, match);
    }

    // Trim non-brackets
    tail = tail.replace(finalNonBracketsRe, '');
    for (let i = 0; i < tail.length; i++) {
      const text = head + tail.substr(0, i);
      if (isBalanced(text)) {
        return linkIfCorrect(regexp, text, match);
      }
    }

    return linkIfCorrect(regexp, head + tail, match);
  });
}

function linkIfCorrect(re: RegExp, text: string, match: RegExpMatchArray): Link | null {
  const idx = re.lastIndex;
  re.lastIndex = 0;
  const ok = re.test(text);
  re.lastIndex = idx;
  const charAfter = match.input!.charAt(match.index! + text.length);
  return ok && (charAfter === '' || wordAdjacentCharsRe.test(charAfter))
    ? new Link(match.index!, text)
    : null;
}

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
