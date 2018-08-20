import { tokenize, EMail } from './emails';
import { tableTest } from './test-helpers';

tableTest('emails', tokenize, [
  [
    'aa@bb.ru bb@xn--80aaazglcmlcj.xn--p1ai',
    [new EMail(0, 'aa@bb.ru'), new EMail(9, 'bb@xn--80aaazglcmlcj.xn--p1ai')],
  ],
  ['john+smith@gmail.com', [new EMail(0, 'john+smith@gmail.com')]],
  ['freefeed.net@gmail.com', [new EMail(0, 'freefeed.net@gmail.com')]],
  ['супер@окна.рф!!!', [new EMail(0, 'супер@окна.рф')]],
]);
