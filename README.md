# social-text-tokenizer

A package for parsing texts of posts and comments. It is designed for freefeed.net texts, but can be adapted for other services as well.

## Quick start

```typescript
import {
  arrows,
  emails,
  foreignMentions,
  hashtags,
  links,
  mentions,
  withTexts,
} from 'social-text-tokenizer';

// Find in text arrows, emails, foreignMentions, hashtags,
// links and mentions, merge results and fill gaps with
// tokens of type 'text'.
const parse = withTexts(
  arrows(),
  emails(),
  foreignMentions(),
  hashtags(),
  links(),
  mentions(),
);

const tokens = parse('some text');
```

## Details

### Tokens and tokenizers

**Tokenizer** is a function that takes text and returns array of found tokens of
some type(s):

```typescript
type Tokenizer = (text: string) => Token[];
```

Usually, a specific tokenizer is responsible for tokens of specific type, and
looking only for them in text. For example, the `emails()` tokenizer only
returns tokens of type `'email'`.

**Token** describes a found piece of text:

```typescript
type Token = {
  readonly type: string;
  readonly offset: number;
  readonly text: string;
};
```

Token _type_ is a string, the library exports some constants for predefined
tokenizers: TEXT, LINK, EMAIL, etc. _Offset_ is the start location of the token
in the string being parsed, and _text_ is the textual content of the token.
_Text_ is always a substring of the parsed string starting at _offset_.

### Getting result: the `withTexts()` function

The `withTexts()` function combines the results of multiple tokenizers, leaves
only non-overlapping tokens, and in case of conflict leaves the token that
starts earlier or has longer text. It also inserts tokens of type 'TEXT' between
other tokens. This function should be called at the top level of parsing, as it
returns its final result as a sequence of tokens covering the entire string.

```typescript
function withTexts(...tokenizers: Tokenizer[]): Tokenizer;
```

For example:

```typescript
const parse = withTexts(emails());

const tokens = parse('My address is user@example.com!');

expect(tokens).toEqual([
  { type: 'TEXT', offset: 0, text: 'My address is ' },
  { type: 'EMAIL', offset: 14, text: 'user@example.com' },
  { type: 'TEXT', offset: 30, text: '!' },
]);
```

## API

This package exposes API in several entry points:

- [`social-text-tokenizer`](#package-root) (package root)
- [`social-text-tokenizer/prettifiers`](#prettifiers)
- [`social-text-tokenizer/utils`](#utils)
- [`social-text-tokenizer/filters`](#filters)

### Package root

These functions must be imported from the package itself:

```typescript
import {...} from 'social-text-tokenizer';
```

#### Tokenizers

The predefined tokenizers are:

- `arrows()` — looking for FreeFeed-style references to the upper comment.
  Produces tokens of type `ARROW`. Examples: `^^`, `^10`, `↑↑`.
- `emails()` — looking for email addresses. Produces tokens of type `EMAIL`.
  Example: `user@example.com`.
- `foreignMentions()` — looking for FreeFeed-style mentions of users of another
  service. Produces tokens of type `FOREIGN_MENTION`. Examples:
  `username@twitter`, `username@tg`.
- `hashtags()` — looking for hashtags. Produces tokens of type `HASHTAG`.
  Example: `#3pm`.
- `links()` — looking for URLs. Produces tokens of type `LINK`. Examples:
  `example.com`, `www.example.com`, `https://example.com`.
- `mentions()` — looking for mentions of users. Produces tokens of type
  `MENTION`. Examples: `@username`.

These functions are not tokenizers itself, but functions that _returns_
tokenizers. This is done because each of them accepts an optional parameter that
allows you to configure the resulting tokenizer. Usually this is a regular
expression, but it is better to refer to the source code for the specific type
of parameter.

#### `combine()`

```typescript
function combine(...tokenizers: Tokenizer[]): Tokenizer;
```

_combine_ combines multiple tokenizers into one. It leaves only non-overlapping
tokens, and in case of conflict leaves the token that starts earlier or has
longer text.

_combine_ guarantees that the resulting tokenizer will return properly ordered
and non-overlapped tokens, even if source tokenizers produces loose ordered
result.

#### `withTexts()`

```typescript
function withTexts(...tokenizers: Tokenizer[]): Tokenizer;
```

Works the same as _combine_, but inserts tokens of type `TEXT` between other
tokens. This function should be called at the top level of parsing, as it
returns its final result as a sequence of tokens covering the entire string.

### Prettifiers

These functions must be imported from the './prettifiers' entry point:

```typescript
import {...} from 'social-text-tokenizer/prettifiers';
```

This endpoint exports some helper functions that prepare text for use in HTML.

#### `linkHref()`

```typescript
function linkHref(text: string): string;
```

Prepare the LINK-token's text for use in _href_ attribute.

#### `emailHref()`

```typescript
function emailHref(text: string): string;
```

Prepare the EMAIL-token's text for use in _href_ attribute (starts from
'mailto:...').

#### `prettyLink()`

```typescript
function prettyLink(text: string, maxLength = Infinity): string;
```

Prepare the LINK-token's text for use in visible HTML. It omits URL schema,
url-decodes URL segments, etc. Optional _maxLength_ argument allows to limit the
resulting string length.

#### `prettyEmail()`

```typescript
function prettyEmail(text: string): string;
```

Prepare the EMAIL-token's text for use in visible HTML.

### Utils

These functions must be imported from the './utils' entry point:

```typescript
import {...} from 'social-text-tokenizer/utils';
```

This endpoint exports functions that help you create your own tokenizers.

#### `reTokenizer()`

```typescript
type MatchProcessor = (
  offset: number,
  text: string,
  match: RegExpMatchArray,
) => Token | null;

function reTokenizer(regex: RegExp, processMatch: MatchProcessor): Tokenizer;
```

Creates tokenizer that found texts matches the given _regex_. The second
argument, _processMatch_, should create token from the given match.

#### `makeToken()`

```typescript
function makeToken(type: string): (offset: number, text: string) => Token;
```

A simple helper that create fabric of Tokens of given type. Especially useful
for use with _reTokenizer_ as its second argument:

```typescript
const aaaTokenizer = reTokenizer(/aaa+/g, makeToken('AAA'));
```

#### `class Characters`

_Characters_ is a class that holds one or more ranges of Unicode character
codes:

```typescript
type TupleArg = number | [number, number];
type SomeTuples = [TupleArg, ...TupleArg[]];
type Range = [number, number];

declare class Characters {
  constructor(chars: string);
  constructor(...tuples: TupleArg[]);
  withCodes(...tuples: SomeTuples): Characters;
  withChars(chars: string): Characters;
  withoutCodes(...tuples: SomeTuples): Characters;
  withoutChars(chars: string): Characters;
  includesCode(code: number): boolean;
  includesChar(ch: string): boolean;
  toString(): string;
}
```

This is a fairly low-level tool that helps you check if a given character
belongs to some character set.

#### Predefined character sets

```typescript
const spacesAndPunctuation: Characters;
const wordAdjacentChars: Characters;
const ignoredInURLChars: Characters;
```

### Filters

These functions must be imported from the './filters' entry point:

```typescript
import {...} from 'social-text-tokenizer/filters';
```

This endpoint exports functions that helps process tokenizer result.

#### `type TokenFilter`

```typescript
type TokenFilter = (token: Token, input: string) => Token | null;
```

_TokenFilter_ is a function that takes token and the full input text, and
returns same or altered token, or null. Null means "skip it".

#### `combineFilters()`

```typescript
function combineFilters(...filters: TokenFilter[]): TokenFilter;
```

_combineFilters_ combines multiple token filters into one. Filters applies from
left to right.

#### `withFilters()`

```typescript
function withFilters(
  tokenizer: Tokenizer,
  ...filters: TokenFilter[]
): Tokenizer;
```

_withFilters_ applies filter to the given tokenizer, from left to right.

#### `withCharsBefore()`

```typescript
function withCharsBefore(
  chars: Characters,
  allowStartOfText = true,
): TokenFilter;
```

_withCharsBefore_ is a filter that checks, if the char right before token
contained in _chars_.

#### `withCharsAfter()`

```typescript
function withCharsAfter(chars: Characters, allowEndOfText = true): TokenFilter;
```

_withCharsAfter_ is a filter that checks, if the char right after token
contained in _chars_.

#### `withWordBoundaries`

```typescript
const withWordBoundaries = combineFilters(
  withCharsBefore(wordAdjacentChars),
  withCharsAfter(wordAdjacentChars),
);
```

_withWordBoundaries_ is a filter that checks, if token is not connected to the
some word, before or after it.
