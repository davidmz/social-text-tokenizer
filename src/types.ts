export abstract class Token {
  offset: number;
  text: string;

  constructor(offset: number, text: string) {
    this.offset = offset;
    this.text = text;
  }
}

export interface Tokenizer {
  (text: string): Token[];
}
