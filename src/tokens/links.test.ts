import { LINK } from '../token-types';
import { makeToken } from '../utils';
import { tableTest } from '../utils/test-helpers';
import { links } from './links';

const tok = makeToken(LINK);

tableTest('links', links(), [
  ['http://www.example.com', [tok(0, 'http://www.example.com')]],
  ['abchttp://example.com', []],
  ['https://example.com', [tok(0, 'https://example.com')]],
  ['ftp://example.com', [tok(0, 'ftp://example.com')]],
  ['http://example.com/', [tok(0, 'http://example.com/')]],
  ['http://example.com/!!', [tok(0, 'http://example.com/')]],
  ['(http://example.com/)', [tok(1, 'http://example.com/')]],
  ['(http://example.com/(ab))!', [tok(1, 'http://example.com/(ab)')]],
  ['example.com.', [tok(0, 'example.com')]],
  ['example.com/path?x=1&y=2,', [tok(0, 'example.com/path?x=1&y=2')]],
  ['(example.com)', [tok(1, 'example.com')]],
  [
    "Марко д’Аграте (en.wikipedia.org/wiki/Marco_d'Agrate)",
    [tok(16, "en.wikipedia.org/wiki/Marco_d'Agrate")],
  ],
  // A final punctuation-only tail is trimmed when the remaining URL is already balanced.
  ['(example.com/path())', [tok(1, 'example.com/path')]],
  ['(example.com/path()))', [tok(1, 'example.com/path')]],
  ['www.example.com', [tok(0, 'www.example.com')]],
  // Domain-like matches are intentionally permissive and may start inside a word.
  ['abcexample.com', [tok(0, 'abcexample.com')]],
  ['abcwww.example.com', [tok(0, 'abcwww.example.com')]],
  ['abcwww.example.com/', [tok(0, 'abcwww.example.com/')]],
  ['(www.example.com/(ab))!', [tok(1, 'www.example.com/(ab)')]],
  ['abcwww.example.common/', []],
  ['www.example.com/ab_!', [tok(0, 'www.example.com/ab_')]],
  // Double quotes
  ['example.com/ab_?q="hello"', [tok(0, 'example.com/ab_?q="hello"')]],
  ['"example.com/ab?q="x""', [tok(1, 'example.com/ab?q="x"')]],
  ['"example.com/ab_?q="hello""', [tok(1, 'example.com/ab_?q="hello"')]],
  [
    'example.com/ab_?q="hello"+"word"',
    [tok(0, 'example.com/ab_?q="hello"+"word"')],
  ],
  ['example.com/ab_?q="hell\'o"', [tok(0, 'example.com/ab_?q="hell\'o"')]],

  ['http://example.net', [tok(0, 'http://example.net')]],
  ['www.example.net', [tok(0, 'www.example.net')]],
  ['example.net', [tok(0, 'example.net')]],
  ['abc.example.net', [tok(0, 'abc.example.net')]],
  ['moscow.info', []],
  ['www.moscow.info', [tok(0, 'www.moscow.info')]],
  ['microsoft.com…', [tok(0, 'microsoft.com')]],
  ['I should go to lurkmore.to!', [tok(15, 'lurkmore.to')]],

  ['example.ru:2423/aaa!!', [tok(0, 'example.ru:2423/aaa')]],
  ['пластиковые-окна.рф:2423/aaa!!', [tok(0, 'пластиковые-окна.рф:2423/aaa')]],
  [
    'xn--80aaazglcmlcj.xn--p1ai/p49838778-blokirator-okna-bsl.html',
    [tok(0, 'xn--80aaazglcmlcj.xn--p1ai/p49838778-blokirator-okna-bsl.html')],
  ],

  [
    'https://www.youtube.com/playlist?list=PLoN0DWDChjH9sPVc8m-aXdxmeMxgT1jG-',
    [
      tok(
        0,
        'https://www.youtube.com/playlist?list=PLoN0DWDChjH9sPVc8m-aXdxmeMxgT1jG-',
      ),
    ],
  ],
  [
    'ru.wikipedia.org/wiki/Колода_«Русский_стиль»',
    [tok(0, 'ru.wikipedia.org/wiki/Колода_«Русский_стиль»')],
  ],
  ['example.com/ab_?q=hello*', [tok(0, 'example.com/ab_?q=hello*')]],

  ['*.example.com', []],
  ['http://?!!?', []],
  ['www.', []],
]);
