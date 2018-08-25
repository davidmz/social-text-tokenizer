import { tokenize, Arrows } from './arrows';
import { tableTest } from './lib/test-helpers';

tableTest('arrows', tokenize, [
  [' ^^ \u2191\u2191\u2191 ', [new Arrows(1, '^^'), new Arrows(4, '\u2191\u2191\u2191')]],
  [' ^W ^H ', []],
  ['10^6 or (=^・^=)', []],
]);
