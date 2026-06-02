import { useMemo } from 'react';

export interface BionicWord {
  original: string;
  anchor: string;
  rest: string;
  suffix: string;
  isPunctuation: boolean;
}

export const useBionic = (text: string, ratio: number = 40) => {
  const processedWords = useMemo(() => {
    if (!text) return [];

    return text.split(/(\s+)/).map((part): BionicWord => {
      // If it's just whitespace, return as-is (though usually handled by split)
      if (/^\s+$/.test(part)) {
        return { original: part, anchor: '', rest: part, suffix: '', isPunctuation: false };
      }

      // Handle words
      const match = part.match(/^([a-zA-Z0-9'’]+)(.*)$/);
      if (!match) {
        return { original: part, anchor: '', rest: part, suffix: '', isPunctuation: true };
      }

      const [_, word, suffix] = match;
      const anchorLength = Math.max(1, Math.round(word.length * (ratio / 100)));
      
      return {
        original: part,
        anchor: word.slice(0, anchorLength),
        rest: word.slice(anchorLength),
        suffix: suffix,
        isPunctuation: false
      };
    });
  }, [text, ratio]);

  return { processedWords };
};
