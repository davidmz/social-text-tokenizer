import combine from './combine';
import { Token, Tokenizer } from './types';

class Token1 extends Token {}
class Token2 extends Token {}

describe('combine', () => {
  it('should emit an empty array', () => {
    const c = combine();
    expect(c('')).toEqual([]);
  });

  it('should tokenize text with one tokenizer', () => {
    const c = combine(
      // 12[345]67[8]90
      tt1([2, '345'], [7, '8'])
    );
    expect(c('')).toEqual([new Token1(2, '345'), new Token1(7, '8')]);
  });

  it('should tokenize text with two owerlapped tokenizers', () => {
    const c = combine(
      // 12[345]67[8]90
      tt1([2, '345'], [7, '8']),
      // 123[45]6[789]0
      tt2([3, '45'], [6, '789'])
    );
    expect(c('')).toEqual([new Token1(2, '345'), new Token2(6, '789')]);
  });

  it('should choose a longest token from two with the same offset', () => {
    const c = combine(
      // 12[345]6[78]90
      tt1([2, '345'], [6, '78']),
      // 12[34]56[789]0
      tt2([2, '34'], [6, '789'])
    );
    expect(c('')).toEqual([new Token1(2, '345'), new Token2(6, '789')]);
  });

  describe('Edge cases with zero-width items', () => {
    it('should tokenize text with zero-width item', () => {
      const c = combine(tt1([1, '']));
      expect(c('')).toEqual([new Token1(1, '')]);
    });

    it('should tokenize text with two zero-width items with the same offset', () => {
      const c = combine(tt1([1, '']), tt2([1, '']));
      expect(c('')).toEqual([new Token1(1, '')]);
    });
  });
});

//////////////////

type TokenData = [number, string];

function tt1(...data: TokenData[]): Tokenizer {
  return () => data.map((d) => new Token1(d[0], d[1]));
}

function tt2(...data: TokenData[]): Tokenizer {
  return () => data.map((d) => new Token2(d[0], d[1]));
}
