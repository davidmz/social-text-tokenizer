# AGENTS.md

## Project Overview

This repository contains `social-text-tokenizer`, a TypeScript library for parsing post and comment text.

Primary use case:

- tokenize FreeFeed-style text into structured tokens such as links, emails, hashtags, mentions, foreign mentions, arrows, and plain text fragments.

Core behavior:

- individual tokenizers find tokens of one kind;
- `combine()` merges tokenizer outputs and removes overlaps;
- `withTexts()` inserts `TEXT` tokens between recognized tokens so the final result covers the full input string.

## Stack

- Language: TypeScript
- Test runner: Vitest
- Linting: ESLint + typescript-eslint + Prettier
- Build: `@davidmz/ts-lib-build`
- Package manager: pnpm

## Repository Layout

- `src/index.ts` - main public API exports.
- `src/combine.ts` - merges tokens from multiple tokenizers.
- `src/with-texts.ts` - produces a full token stream including `TEXT` gaps.
- `src/token-types.ts` - exported token type constants.
- `src/types.ts` - core `Token` and `Tokenizer` types.
- `src/tokens/` - built-in tokenizers and their tests.
- `src/prettifiers/` - helpers for HTML-facing formatting of links and emails.
- `src/utils/` - tokenizer construction helpers, unicode character utilities.
- `src/filters/` - token filters used to refine tokenizer matches.
- `src/legacy-tests/` - legacy compatibility tests, excluded from TypeScript compile.
- `build/` - generated publish output. Do not edit manually.

## Public API Surface

Main package exports:

- `combine`
- `withTexts`
- `Token`, `Tokenizer`
- token type constants
- built-in tokenizer factories from `src/tokens/*`

Additional publishable entry points are configured in `ts-lib-build.config.json`:

- package root
- `filters`
- `utils`
- `prettifiers`

When changing exports, keep source exports and build entry-point expectations aligned.

## Development Commands

- `pnpm test` - run Vitest once.
- `pnpm check` - run typecheck, lint, and tests in parallel.
- `pnpm build` - run checks, then generate publishable output in `build/`.

## Working Rules For Agents

- Prefer minimal changes that preserve the existing library shape.
- Follow current code style and naming. This codebase is small and intentionally direct.
- Keep behavior backward compatible unless the task explicitly requires a breaking change.
- Add or update tests when tokenizer behavior changes.
- Do not edit generated files under `build/` unless the task explicitly requires refreshing build output.
- Be careful with overlap resolution semantics in `combine()` and gap-filling semantics in `withTexts()`; they are central to the library.
- Treat regex changes as behavior changes and verify them with focused tests.
- Preserve public entry points and exported types unless the user asks for API changes.

## Implementation Notes

- Tokenizers are factory functions, not plain tokenizer instances. Many accept optional configuration.
- Link parsing is one of the more nuanced parts of the codebase and includes punctuation trimming and bracket balancing.
- Utilities under `src/utils/characters/` support unicode-aware character range handling.
- The package is intended as a library, so avoid introducing runtime logging, CLI assumptions, or app-specific behavior.

## Validation Expectations

For code changes, prefer this order:

1. Run targeted tests if the change is localized.
2. Run `pnpm check` if the change affects exported behavior or multiple files.
3. Run `pnpm build` only when build artifacts need verification or regeneration.

## Safe Change Areas

Usually safe to modify:

- files in `src/tokens/` together with their tests;
- helpers in `src/prettifiers/` with matching tests;
- internal utility code that does not alter public exports.

Requires extra care:

- `src/index.ts` and any export surface;
- `src/combine.ts` and `src/with-texts.ts`;
- regex-heavy tokenizers such as `src/tokens/links.ts`;
- anything that would require updating published build artifacts.
