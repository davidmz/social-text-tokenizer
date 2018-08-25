export abstract class Token {
  readonly type: string;
  readonly offset: number;
  readonly text: string;

  constructor(offset: number, text: string) {
    this.type = this.constructor.name;
    this.offset = offset;
    this.text = text;
  }
}

export interface Tokenizer {
  (text: string): Token[];
}

export interface Prettifier {
  pretty: string;
}
