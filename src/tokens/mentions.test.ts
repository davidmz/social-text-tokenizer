import { MENTION } from '../token-types';
import { makeToken } from '../utils';
import { tableTest } from '../utils/test-helpers';
import { mentions } from './mentions';

const tok = makeToken(MENTION);

tableTest('mentions', mentions(), [
  [' @alice @bob-by ', [tok(1, '@alice'), tok(8, '@bob-by')]],
  ['@alice_bob', []],
  ['ab@cd', []],
  ['@aliceмиелофон', []],
  ['«@alice»', [tok(1, '@alice')]],
  ['@alice,@bob!', [tok(0, '@alice'), tok(7, '@bob')]],
  ["@alice's @alice’s", [tok(0, '@alice'), tok(9, '@alice')]],
  ["@Alice's @alicE’s", [tok(0, '@Alice'), tok(9, '@alicE')]],
  ['@bob-ский', [tok(0, '@bob')]],
  ['@bob-', []],
]);
