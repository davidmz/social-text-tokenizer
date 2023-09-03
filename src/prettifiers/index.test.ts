import { describe, expect, it } from 'vitest';

import { linkHref, prettyEmail, prettyLink } from '.';

describe('prettifyEmail', () => {
  it('should not change regular email', () => {
    expect(prettyEmail('user@example.com')).toBe('user@example.com');
  });

  it('should de-punycode host part', () => {
    expect(prettyEmail('user@xn--80aaazglcmlcj.xn--p1ai')).toBe(
      'user@замкинаокна.рф',
    );
  });

  it('should not de-punycode user part', () => {
    expect(prettyEmail('xn--p1ai@xn--80aaazglcmlcj.xn--p1ai')).toBe(
      'xn--p1ai@замкинаокна.рф',
    );
  });
});

describe('linkURL', () => {
  it('should not modify full url', () => {
    expect(linkHref('http://example.com/abc')).toBe('http://example.com/abc');
  });

  it('should add schema before url', () => {
    expect(linkHref('example.com/abc')).toBe('https://example.com/abc');
  });

  it('should add slash after url', () => {
    expect(linkHref('example.com')).toBe('https://example.com/');
  });

  it('should remove control characters from URL', () => {
    expect(linkHref('https://Piped.looleh.xyz\u200E/')).toBe(
      'https://Piped.looleh.xyz/',
    );
  });
});

describe('pretty', () => {
  it('should trim url schema', () => {
    expect(prettyLink('https://example.com/abc')).toBe('example.com/abc');
  });

  it('should not add schema before url', () => {
    expect(prettyLink('example.com/abc')).toBe('example.com/abc');
  });

  it('should strip slash after url', () => {
    expect(prettyLink('http://example.com/')).toBe('example.com');
  });

  it('should de-punycode host part', () => {
    expect(
      prettyLink(
        'xn--80aaazglcmlcj.xn--p1ai/p49838778-blokirator-okna-bsl.html',
      ),
    ).toBe('замкинаокна.рф/p49838778-blokirator-okna-bsl.html');
  });

  it('should de-urlencode url', () => {
    expect(
      prettyLink(
        'https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0',
      ),
    ).toBe('ru.wikipedia.org/wiki/Заглавная_страница');
  });
});

describe('shorten', () => {
  it('should not shorten short url', () => {
    expect(prettyLink('example.com/abc', 20)).toBe('example.com/abc');
  });
  it('should shorten url to host', () => {
    expect(prettyLink('example.com/abc', 6)).toBe('example.com/\u2026');
  });
  it('should shorten url to part of path', () => {
    expect(prettyLink('example.com/abc/def', 17)).toBe(
      'example.com/abc/\u2026',
    );
  });
});
