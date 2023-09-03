import { EMAIL } from '../token-types';
import { makeToken } from '../utils';
import { tableTest } from '../utils/test-helpers';
import { emails } from './emails';

const tok = makeToken(EMAIL);

tableTest('hashtags', emails(), [
  [
    'aa@bb.ru bb@xn--80aaazglcmlcj.xn--p1ai',
    [tok(0, 'aa@bb.ru'), tok(9, 'bb@xn--80aaazglcmlcj.xn--p1ai')],
  ],
  ['john+smith@gmail.com', [tok(0, 'john+smith@gmail.com')]],
  ['freefeed.net@gmail.com', [tok(0, 'freefeed.net@gmail.com')]],
  ['супер@окна.рф!!!', [tok(0, 'супер@окна.рф')]],
  ['СУПЕР@окна.рф!!!', [tok(0, 'СУПЕР@окна.рф')]],
]);
