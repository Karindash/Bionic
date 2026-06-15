export interface DictionaryEntry {
  word: string;
  definition: string;
  partOfSpeech: string;
  synonyms: string[];
  antonyms?: string[];
}

/**
 * Specifically optimized for Merriam-Webster Collegiate Thesaurus API
 * Product: https://dictionaryapi.com/products/api-collegiate-thesaurus
 */
const API_KEY = import.meta.env.VITE_MW_API_KEY;
const BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/';

// Cache to prevent repetitive API calls
const cache: Record<string, DictionaryEntry> = {};

export const dictionaryService = {
  lookup: async (word: string): Promise<DictionaryEntry | null> => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');

    if (cleanWord.length < 2) return null;
    if (cache[cleanWord]) return cache[cleanWord];

    // Auto-Mock if no key is provided or placeholder used
    const isMock = !API_KEY || API_KEY === 'your-merriam-webster-key';

    if (isMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mock: DictionaryEntry = {
            word: cleanWord,
            definition: `(Mock) This is a placeholder for "${cleanWord}". Connect your Collegiate Thesaurus key to see real synonyms.`,
            partOfSpeech: 'noun',
            synonyms: ['sample', 'mockup', 'example'],
            antonyms: ['original', 'authentic']
          };
          cache[cleanWord] = mock;
          resolve(mock);
        }, 200);
      });
    }

    try {
      const response = await fetch(`${BASE_URL}${cleanWord}?key=${API_KEY}`);
      const rawText = await response.text();

      // Handle plain text errors from MW
      if (rawText.includes('Invalid API key') || rawText.includes('Not subscribed')) {
        console.error(`MW Thesaurus Auth Error: ${rawText}`);
        return null;
      }

      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn('MW Thesaurus returned non-JSON:', rawText);
        return null;
      }

      // Collegiate Thesaurus returns an array of entries
      if (Array.isArray(data) && data.length > 0) {
        // If the first element is a string, it's a suggestion list (word not found)
        if (typeof data[0] === 'string') return null;

        const entry = data[0];
        
        // Collegiate Thesaurus Schema:
        // - shortdef: array of definition strings
        // - fl: functional label (part of speech)
        // - meta.syns: array of arrays of synonyms
        // - meta.ants: array of arrays of antonyms
        const result: DictionaryEntry = {
          word: cleanWord,
          definition: entry.shortdef?.[0] || 'Definition not found.',
          partOfSpeech: entry.fl || 'word',
          synonyms: entry.meta?.syns?.[0] || [],
          antonyms: entry.meta?.ants?.[0] || []
        };
        
        cache[cleanWord] = result;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Thesaurus Lookup Exception:', error);
      return null;
    }
  }
};
