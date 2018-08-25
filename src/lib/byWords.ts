import regexpTokeniser, { MatchProcessor } from './byRegexp';
import { wordAdjacentChars } from './chars';

const adjacentChars = new RegExp(`[${wordAdjacentChars}]`);

export default function byWords(wordRegex: RegExp, processMatch: MatchProcessor) {
  return regexpTokeniser(wordRegex, (offset, text, match) => {
    const charBefore = match.input.charAt(offset - 1);
    const charAfter = match.input.charAt(offset + text.length);
    if (
      (charBefore !== '' && !adjacentChars.test(charBefore)) ||
      (charAfter !== '' && !adjacentChars.test(charAfter))
    ) {
      return null;
    }
    return processMatch(offset, text, match);
  });
}
