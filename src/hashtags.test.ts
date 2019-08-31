import { tokenize, HashTag } from './hashtags';
import { tableTest } from './lib/test-helpers';

tableTest('hashtags', tokenize(), [
  ['#hashtag', [new HashTag(0, '#hashtag')]],
  ['#а-я, #c-d', [new HashTag(0, '#а-я'), new HashTag(6, '#c-d')]],
  ['"#a-b", #c-d-', [new HashTag(1, '#a-b')]],
]);
