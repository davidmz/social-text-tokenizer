export type Token = {
  readonly type: string;
  readonly offset: number;
  readonly text: string;
};

// Tokenizer generates a sequence of tokens occurring in a given text
export type Tokenizer = (text: string) => Token[];
