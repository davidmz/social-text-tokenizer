import { describe, expect, it } from 'vitest';

import { combine } from './combine';
import type { Token } from './types';
import { makeToken } from './utils';

const tok = makeToken('test');
const tok1 = makeToken('test1');

const testData: { title: string; input: Token[][]; output: Token[] }[] = [
  { title: 'empty inputs', input: [], output: [] },
  {
    title: 'single tokenizer',
    input: [
      // [ab][cde]rghijk
      [tok(0, 'ab'), tok(3, 'cde')],
    ],
    output: [tok(0, 'ab'), tok(3, 'cde')],
  },
  {
    title: 'two tokenizers with overlapping tokens',
    input: [
      // [abcd]efghijk
      [tok(0, 'abcd')],
      // ab[cd]efghijk
      [tok(2, 'cd')],
    ],
    output: [tok(0, 'abcd')],
  },
  {
    title:
      'two tokenizers with overlapping tokens with same offsets, priority to first',
    input: [
      // [abcd]efghijk
      [tok(0, 'abcd')],
      // [ab]cdefghijk
      [tok(0, 'ab')],
    ],
    output: [tok(0, 'abcd')],
  },
  {
    title:
      'two tokenizers with overlapping tokens with same offsets, priority to second',
    input: [
      // [abcd]efghijk
      [tok(0, 'abcd')],
      // [abcdef]ghijk
      [tok(0, 'abcdef')],
    ],
    output: [tok(0, 'abcdef')],
  },
  {
    title: 'three tokenizers with overlapping tokens',
    input: [
      // [abcd][ef]ghijk
      [tok(0, 'abcd'), tok(5, 'ef')],
      // [abcdef]ghijk
      [tok(0, 'abcdef')],
      // [abc][defg]h[ijk]
      [tok(0, 'abc'), tok(3, 'defg'), tok(8, 'ijk')],
    ],
    output: [tok(0, 'abcdef'), tok(8, 'ijk')],
  },
  {
    title: 'two overlapping tokenizers',
    input: [
      // 12[345]67[8]90
      [tok(2, '345'), tok(7, '8')],
      // 123[45]6[789]0
      [tok(3, '45'), tok(6, '789')],
    ],
    output: [tok(2, '345'), tok(6, '789')],
  },
  {
    title: 'a longest token from two with the same offset',
    input: [
      // 12[345]6[78]90
      [tok(2, '345'), tok(6, '78')],
      // 12[34]56[789]0
      [tok(2, '34'), tok(6, '789')],
    ],
    output: [tok(2, '345'), tok(6, '789')],
  },
  {
    title: 'two tokenizers with the same tokens',
    input: [[tok(2, '345')], [tok1(2, '345')]],
    output: [tok(2, '345')],
  },
  {
    title: 'text with zero-width item',
    input: [[tok(1, '')]],
    output: [tok(1, '')],
  },
  //  Fixing edge cases
  {
    title: 'one tokenizer with weird token order',
    input: [
      // 12[[345]6]7[8]90
      [tok(7, '8'), tok(2, '345'), tok(2, '3456')],
    ],
    output: [tok(2, '3456'), tok(7, '8')],
  },
];

describe('combine', () => {
  for (const { title, input, output } of testData) {
    it(`should test ${title}`, () => {
      const tokenizers = input.map((tokens) => () => tokens);
      expect(combine(...tokenizers)('')).toEqual(output);
    });
  }
});
