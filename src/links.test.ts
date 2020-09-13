import { tokenize, Link } from './links';
import { tableTest } from './lib/test-helpers';

tableTest('links', tokenize(), [
  ['http://www.example.com', [new Link(0, 'http://www.example.com')]],
  ['abchttp://example.com', []],
  ['https://example.com', [new Link(0, 'https://example.com')]],
  ['ftp://example.com', [new Link(0, 'ftp://example.com')]],
  ['http://example.com/', [new Link(0, 'http://example.com/')]],
  ['http://example.com/!!', [new Link(0, 'http://example.com/')]],
  ['(http://example.com/)', [new Link(1, 'http://example.com/')]],
  ['(http://example.com/(ab))!', [new Link(1, 'http://example.com/(ab)')]],
  ['www.example.com', [new Link(0, 'www.example.com')]],
  ['abcwww.example.com', [new Link(0, 'abcwww.example.com')]],
  ['abcwww.example.com/', [new Link(0, 'abcwww.example.com/')]],
  ['(www.example.com/(ab))!', [new Link(1, 'www.example.com/(ab)')]],
  ['abcwww.example.common/', []],
  ['www.example.com/ab_!', [new Link(0, 'www.example.com/ab_')]],
  // Double quotes
  ['example.com/ab_?q="hello"', [new Link(0, 'example.com/ab_?q="hello"')]],
  ['"example.com/ab_?q="hello""', [new Link(1, 'example.com/ab_?q="hello"')]],
  ['example.com/ab_?q="hello"+"word"', [new Link(0, 'example.com/ab_?q="hello"+"word"')]],
  ['example.com/ab_?q="hell\'o"', [new Link(0, 'example.com/ab_?q="hell\'o"')]],

  ['http://example.net', [new Link(0, 'http://example.net')]],
  ['www.example.net', [new Link(0, 'www.example.net')]],
  ['example.net', [new Link(0, 'example.net')]],
  ['moscow.info', []],
  ['www.moscow.info', [new Link(0, 'www.moscow.info')]],
  ['microsoft.com…', [new Link(0, 'microsoft.com')]],
  ['I should go to lurkmore.to!', [new Link(15, 'lurkmore.to')]],

  ['example.ru:2423/aaa!!', [new Link(0, 'example.ru:2423/aaa')]],
  ['пластиковые-окна.рф:2423/aaa!!', [new Link(0, 'пластиковые-окна.рф:2423/aaa')]],
  [
    'xn--80aaazglcmlcj.xn--p1ai/p49838778-blokirator-okna-bsl.html',
    [new Link(0, 'xn--80aaazglcmlcj.xn--p1ai/p49838778-blokirator-okna-bsl.html')],
  ],

  [
    'https://www.youtube.com/playlist?list=PLoN0DWDChjH9sPVc8m-aXdxmeMxgT1jG-',
    [new Link(0, 'https://www.youtube.com/playlist?list=PLoN0DWDChjH9sPVc8m-aXdxmeMxgT1jG-')],
  ],
  [
    'ru.wikipedia.org/wiki/Колода_«Русский_стиль»',
    [new Link(0, 'ru.wikipedia.org/wiki/Колода_«Русский_стиль»')],
  ],
  ['example.com/ab_?q=hello*', [new Link(0, 'example.com/ab_?q=hello*')]],

  ['*.example.com', []],
  ['http://?!!?', []],
  ['www.', []],
]);

describe('Link class', () => {
  describe('href', () => {
    it('should not modify full url', () => {
      expect(new Link(0, 'https://example.com/abc').href).toBe('https://example.com/abc');
    });

    it('should add schema before url', () => {
      expect(new Link(0, 'example.com/abc').href).toBe('http://example.com/abc');
    });

    it('should add slash after url', () => {
      expect(new Link(0, 'example.com').href).toBe('http://example.com/');
    });
  });

  describe('pretty', () => {
    it('should trim url schema', () => {
      expect(new Link(0, 'https://example.com/abc').pretty).toBe('example.com/abc');
    });

    it('should not add schema before url', () => {
      expect(new Link(0, 'example.com/abc').pretty).toBe('example.com/abc');
    });

    it('should strip slash after url', () => {
      expect(new Link(0, 'http://example.com/').pretty).toBe('example.com');
    });

    it('should de-punycode host part', () => {
      expect(
        new Link(0, 'xn--80aaazglcmlcj.xn--p1ai/p49838778-blokirator-okna-bsl.html').pretty
      ).toBe('замкинаокна.рф/p49838778-blokirator-okna-bsl.html');
    });

    it('should de-urlencode url', () => {
      expect(
        new Link(
          0,
          'https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0'
        ).pretty
      ).toBe('ru.wikipedia.org/wiki/Заглавная_страница');
    });
  });

  describe('shorten', () => {
    it('should not shorten short url', () => {
      expect(new Link(0, 'example.com/abc').shorten(20)).toBe('example.com/abc');
    });
    it('should shorten url to host', () => {
      expect(new Link(0, 'example.com/abc').shorten(6)).toBe('example.com/\u2026');
    });
    it('should shorten url to part of path', () => {
      expect(new Link(0, 'example.com/abc/def').shorten(17)).toBe('example.com/abc/\u2026');
    });
  });
});
