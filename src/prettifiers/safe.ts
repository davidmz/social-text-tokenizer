import { ignoredInURLChars } from '../utils';

const ignoredInURLRe = new RegExp(`[${ignoredInURLChars}]+`, 'g');

export function safeHref(text: string) {
  return text.replace(ignoredInURLRe, '');
}
