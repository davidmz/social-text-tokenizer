import { HASHTAG } from '../token-types';
import { makeToken } from '../utils';
import { tableTest } from '../utils/test-helpers';
import { hashtags } from './hashtags';

const tok = makeToken(HASHTAG);

tableTest('hashtags', hashtags(), [
  ['#hashtag', [tok(0, '#hashtag')]],
  ['#а-я, #c-d', [tok(0, '#а-я'), tok(6, '#c-d')]],
  ['"#a-b", #c-d-', [tok(1, '#a-b')]],
]);
