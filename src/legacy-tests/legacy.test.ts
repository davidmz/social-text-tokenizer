import { hashTags, emails, mentions, links, arrows } from '..';
import { testData, TestEntryResult, EnrtyType } from './legacy.data';
import { Token, Prettifier } from '../types';
import withText from '../lib/withText';
import combine from '../lib/combine';

describe('Legacy data set', () => {
  const tokenize = withText(combine(hashTags(), emails(), mentions(), links(), arrows()));
  testData.map(({ text, result }) =>
    it(`should parse "${text}"`, () => expect(legacify(tokenize(text))).toEqual(unlegacify(result)))
  );
});

const legacyTypes: { [key: string]: EnrtyType } = {
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

function legacify(ts: (Token | (Token & Prettifier))[]): LegacyResult[] {
  return ts.map((t) => {
    const type = legacyTypes[t.type];
    const text = 'pretty' in t ? t.pretty : t.text;
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
