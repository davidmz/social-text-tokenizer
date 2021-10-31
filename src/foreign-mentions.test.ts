import { tokenize, ForeignMention } from './foreign-mentions';
import { tableTest } from './lib/test-helpers';

tableTest('foreign mentions', tokenize(), [
  [
    ' alice@tg bob@tw-by ',
    [
      new ForeignMention(1, 'alice@tg', 'alice', 'tg'),
      new ForeignMention(10, 'bob@tw', 'bob', 'tw'),
    ],
  ],
  ['@alice_bob', []],
  ['ab@cd', [new ForeignMention(0, 'ab@cd', 'ab', 'cd')]],
  ['a@-', []],
  ['a@b-', []],
]);
