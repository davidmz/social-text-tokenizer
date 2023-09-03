import { ARROWS } from '../token-types';
import { makeToken } from '../utils';
import { tableTest } from '../utils/test-helpers';
import { arrows } from './arrows';

const tok = makeToken(ARROWS);

tableTest('arrows', arrows(), [
  [' ^^ \u2191\u2191\u2191 ', [tok(1, '^^'), tok(4, '\u2191\u2191\u2191')]],
  [' ^W ^H ', []],
  ['10^6 or (=^・^=)', []],
]);

tableTest('arrows', arrows(/\^[1-9]\d*/g), [
  [' ^2 ^01 ^10', [tok(1, '^2'), tok(8, '^10')]],
  [' ^W ^H ', []],
  ['10^6 or (=^・^=)', []],
]);
