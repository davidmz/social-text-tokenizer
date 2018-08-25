import { Token, Tokenizer } from '../types';

export type TestData = [string, Token[]][];

export function tableTest(descr: string, tokenize: Tokenizer, data: TestData) {
  describe(descr, () => {
    data.map(([input, output]) =>
      it(`should parse "${input}"`, () => expect(tokenize(input)).toEqual(output))
    );
  });
}
