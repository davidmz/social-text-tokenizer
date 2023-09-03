import { FOREIGN_MENTION } from '../token-types';
import { makeToken } from '../utils';
import { tableTest } from '../utils/test-helpers';
import { foreignMentions } from './foreign-mentions';

const tok = makeToken(FOREIGN_MENTION);

tableTest('foreignMentions', foreignMentions(), [
  [' alice@tg bob@tw-by ', [tok(1, 'alice@tg'), tok(10, 'bob@tw')]],
  ['@alice_bob', []],
  ['ab@cd', [tok(0, 'ab@cd')]],
  ['a@-', []],
  ['a@b-', []],
]);
