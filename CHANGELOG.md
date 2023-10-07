# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2023-10-07

## Fixed

- Some @mention edge cases (like `@domain.com`)
- Top-level 'main' and 'module' entries of the package.json

## [3.0.0-beta] - 2023-08-30

## Changed

- Public API is fully changed. Package now exposes API in several entry points:
  - `.` - basic functionality (_combine_, _withTexts_, types...) and the default
    tokenizers (_links_, _hashtags_, _emails_ etc.);
  - `./prettifiers` - set of functions that prepares links and emails for pretty
    and safe output;
  - `./utils` - helpers for create custom tokenizers;
  - `./filters` - filters for create custom tokenizers.

## Fixed

- User texts may include non-printable control characters, like `RIGHT-TO-LEFT
MARK` for bi-di texts. These characters have meaning in the text, but should be
  removed from the URL. The new `emailHref()` and `linkHref()` functions removes
  these characters and provides 'href' strings ready for use in HTML attributes.
