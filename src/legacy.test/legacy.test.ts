import createTokenizer, { hashTags, emails, mentions, links, arrows, Email, Link } from '..';
import { testData, TestEntryResult, EnrtyType } from './legacy.data';
import { Token } from '../types';

describe('Legacy data set', () => {
  const tokenize = createTokenizer(hashTags, emails, mentions, links, arrows);
  testData.map(({ text, result }) =>
    it(`should parse "${text}"`, () => expect(legacify(tokenize(text))).toEqual(unlegacify(result)))
  );
});

const legacyTypes = {
  Text: 'text',
  Link: 'link',
  Email: 'email',
  Mention: 'atLink',
  HashTag: 'hashTag',
  Arrows: 'arrow',
};

type LegacyResult = {
  type: EnrtyType;
  text: string;
};

function legacify(ts: Token[]): LegacyResult[] {
  return ts.map((t) => {
    const type = legacyTypes[t.type] as EnrtyType;
    const text = t instanceof Email || t instanceof Link ? t.pretty : t.text;
    return { type, text } as LegacyResult;
  });
}

function unlegacify(data: TestEntryResult): LegacyResult[] {
  return data.map((d) => {
    let { type, text } = d;
    if (d.type === 'link') {
      text = text.replace(/^\w+:\/\//, '');
    }
    if (/^[^\/]+\/$/i.test(text)) {
      text = text.substr(0, text.length - 1);
    }

    if (type == 'localLink') {
      type = 'link';
    }

    return { type, text };
  });
}
