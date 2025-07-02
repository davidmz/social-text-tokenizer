import { toUnicode } from 'punycode.js';

import { safeHref } from './safe';

export function prettyLink(text: string, maxLength = Infinity): string {
  let pretty = text.replace(/^\w+:\/\//, '');
  if (/^[^/]+\/$/i.test(pretty)) {
    pretty = pretty.slice(0, -1);
  }
  try {
    pretty = decodeURIComponent(pretty);
  } catch {
    // do nothing
  }

  const m = /^([^/]+)([^]*)/.exec(pretty);
  if (m) {
    pretty = toUnicode(m[1]) + m[2];
  }

  if (maxLength === Infinity) {
    return pretty;
  }

  return shortenLink(pretty, maxLength);
}

export function linkHref(text: string): string {
  let href = text;
  if (!/^\w+:\/\//i.test(href)) {
    href = `https://${href}`;
  }
  if (/^\w+:\/\/[^/]+$/i.test(href)) {
    href += '/';
  }
  return safeHref(href);
}

/**
 * Shorten pretty-form of URL
 * @param limit maximum length of result
 */
function shortenLink(prettyText: string, limit: number): string {
  let m;
  m = /^([^/]+)(.+)/.exec(prettyText);
  if (!m) {
    return prettyText;
  }
  const [host, tail] = [m[1], m[2]];

  const parts = [];
  const re = /[/?&#_-]/g;
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
