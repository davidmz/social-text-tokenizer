import { toUnicode } from 'punycode';

import { safeHref } from './safe';

export function prettyEmail(text: string): string {
  return toUnicode(text);
}

export function emailHref(text: string): string {
  return safeHref(`mailto:${text}`);
}
