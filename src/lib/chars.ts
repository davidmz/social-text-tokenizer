import CharRanges from '../lib/CharRanges';

export const spacesAndPunctuation = new CharRanges(
  [0, 0x1f], // C0 controls
  [0x20, 0x2f], // ASCII punctuation
  [0x3a, 0x40], // ASCII punctuation
  [0x5b, 0x60], // ASCII punctuation
  [0x7b, 0x7e], // ASCII punctuation
  [0x80, 0x9f], // C1 controls
  [0xa0, 0xbf], // Latin-1 punctuation and symbols
  [0x2010, 0x2027], // General punctuation
  [0x2030, 0x205e], // General punctuation
  0x1680, // Space symbols
  [0x2000, 0x200a], // Space symbols
  [0x2028, 0x2029], // Space symbols
  0x202f, // Space symbols
  0x205f, // Space symbols
  0x3000, // Space symbols
  0x2026 // HORIZONTAL ELLIPSIS
);

export const wordAdjacentChars = spacesAndPunctuation.clone().removeChars('#@-_');
