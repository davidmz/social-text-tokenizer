import { toUnicode } from 'punycode';

import { Token, Tokenizer } from '../types';
import CharRanges from '../CharRanges';
import { wordAdjacentChars } from './chars';
import byRegexp from './byRegexp';
import combine from '../combine';

export class Link extends Token {
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
}

export const tokenize = combine(
  makeTokenizer(/(https?|ftp):\/\/[^\s<>]+/gi), // url with schema
  makeTokenizer(/www\.[^\s<>]+/gi), // started by www.
  makeTokenizer(
    /(?:[a-zа-я0-9][a-zа-я0-9-]*\.)+(?:xn--[a-z0-9]+|рф|com|net|org|edu|[a-z]{2})(?::\d+)?(?:\/[^\s<>]*)?/gi
  ) // url-like pattern
);

// Base latin punctuation except '/', '-', '+', '#' and '&' include ellipsis and quotes
const finalPuncts = new CharRanges()
  .add(
    [0x20, 0x2f], // ASCII punctuation
    [0x3a, 0x40], // ASCII punctuation
    [0x5b, 0x60], // ASCII punctuation
    [0x7b, 0x7e], // ASCII punctuation
    [0xa0, 0xbf], // Latin-1 punctuation and symbols
    [0x2018, 0x201f],
    0x2026 // HORIZONTAL ELLIPSIS
  )
  .removeChars('/-+#&');

const closingBrackets = new CharRanges().addChars(')}]\u00bb');

const wordAdjacentCharsRe = new RegExp(`[${wordAdjacentChars}]`);
const finalPunctsRe = new RegExp(`[${finalPuncts}]+$`);
const closingBracketsRe = new RegExp(`[${closingBrackets}]`);
const noFinalClosingBracketsRe = new RegExp(`[^${closingBrackets}]+$`);
const validBeforeCharsRe = new RegExp(`[${wordAdjacentChars.clone().removeChars('./')}]`);

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

    const headBalance = bracketBalance(head);
    if (!closingBracketsRe.test(tail) || headBalance === 0) {
      // no closing brackets or they are balanced, just cut them all
      return linkIfCorrect(regexp, head, match);
    }

    // trim non-brackets
    tail = tail.replace(noFinalClosingBracketsRe, '');
    let b = headBalance;
    for (let i = 0; i < tail.length; i++) {
      b += bracketWeight(tail.charAt(i));
      if (b === 0) {
        tail = tail.substr(0, i + 1);
        break;
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

const brackets: { [key: string]: number } = {
  '(': 1,
  ')': -1,
  '[': 10,
  ']': -10,
  '{': 100,
  '}': -100,
  '\u00AB': 1000, // LEFT-POINTING DOUBLE ANGLE QUOTATION MARK («)
  '\u00BB': -1000, // RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK (»)
};

function bracketWeight(char: string) {
  return char in brackets ? brackets[char] : 0;
}

function bracketBalance(text: string) {
  return text.split('').reduce((b, c) => b + bracketWeight(c), 0);
}
