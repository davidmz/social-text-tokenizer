import { tokenize, Mention } from './mentions';
import { tableTest } from './lib/test-helpers';

tableTest('mentions', tokenize(), [
  [' @alice @bob-by ', [new Mention(1, '@alice'), new Mention(8, '@bob-by')]],
  ['@alice_bob', []],
  ['ab@cd', []],
  ['@aliceмиелофон', []],
  ['«@alice»', [new Mention(1, '@alice')]],
  ['@alice,@bob!', [new Mention(0, '@alice'), new Mention(7, '@bob')]],
  ["@alice's @alice’s", [new Mention(0, '@alice'), new Mention(9, '@alice')]],
  ["@Alice's @alicE’s", [new Mention(0, '@Alice'), new Mention(9, '@alicE')]],
  ['@bob-ский', [new Mention(0, '@bob')]],
  ['@bob-', []],
]);
