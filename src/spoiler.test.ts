import { tokenize, Spoiler } from './spoiler';
import { tableTest } from './lib/test-helpers';

tableTest('spoilers', tokenize(), [
  ['this is a <spoiler>спойлер</spoiler> indeed', [new Spoiler(10, '<spoiler>спойлер</spoiler>')]],
  [
    '<spoiler>123</spoiler> <Spoiler>234</SPOILER> <spoiler with attr>spoiler</spoiler>',
    [new Spoiler(0, '<spoiler>123</spoiler>'), new Spoiler(23, '<Spoiler>234</SPOILER>')],
  ],
  ['<spoiler>some text', []],
  [
    '<spoiler>outer<spoiler>inner</spoiler></spoiler>',
    [new Spoiler(14, '<spoiler>inner</spoiler>')],
  ],
]);
