import punycode from 'punycode.js';

import { safeHref } from './safe';

export function prettyEmail(text: string): string {
  return punycode.toUnicode(text);
}

export function emailHref(text: string): string {
  return safeHref(`mailto:${text}`);
}
