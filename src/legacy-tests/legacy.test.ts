import { describe, expect, it } from 'vitest';

import type { Token } from '../';
import {
  ARROWS,
  arrows,
  combine,
  EMAIL,
  emails,
  HASHTAG,
  hashtags,
  LINK,
  links,
  MENTION,
  mentions,
  TEXT,
  withTexts,
} from '../';
import { prettyEmail, prettyLink } from '../prettifiers';
import type { EntryType, TestEntryResult } from './legacy.data';
import { testData } from './legacy.data';

describe('Legacy data set', () => {
  const tokenize = withTexts(
    combine(hashtags(), emails(), mentions(), links(), arrows()),
  );
  testData.map(({ text, result }) =>
    it(`should parse "${text}"`, () =>
      expect(legacify([...tokenize(text)])).toEqual(unlegacify(result))),
  );
});

const modernTypes: Record<EntryType, string> = {
  text: TEXT,
  link: LINK,
  localLink: LINK,
  email: EMAIL,
  atLink: MENTION,
  hashTag: HASHTAG,
  arrow: ARROWS,
};

type LegacyResult = {
  type: string;
  text: string;
};

function legacify(ts: Token[]): LegacyResult[] {
  return ts.map((t) => {
    let text = t.text;
    if (t.type === EMAIL) {
      text = prettyEmail(text);
    }
    if (t.type === LINK) {
      const m = /^\w+:\/\//.exec(text);
      const hasSlash = text.endsWith('/');
      text = prettyLink(text);
      if (m) {
        text = m[0] + text;
      }
      if (hasSlash && !text.endsWith('/')) {
        text = text + '/';
      }
    }
    return { type: t.type, text };
  });
}

function unlegacify(data: TestEntryResult): LegacyResult[] {
  return data.map((d) => ({ type: modernTypes[d.type], text: d.text }));
}
