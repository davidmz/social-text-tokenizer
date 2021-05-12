import { tokenize, Arrows } from './arrows';
import { tableTest } from './lib/test-helpers';

tableTest('arrows', tokenize(), [
  [' ^^ \u2191\u2191\u2191 ', [new Arrows(1, '^^'), new Arrows(4, '\u2191\u2191\u2191')]],
  [' ^W ^H ', []],
  ['10^6 or (=^・^=)', []],
]);

tableTest('arrows', tokenize(/\^[1-9]\d*/g), [
  [' ^2 ^01 ^10', [new Arrows(1, '^2'), new Arrows(8, '^10')]],
  [' ^W ^H ', []],
  ['10^6 or (=^・^=)', []],
]);
