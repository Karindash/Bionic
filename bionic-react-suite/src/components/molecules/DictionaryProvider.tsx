import React, { createContext, useContext, useState, useCallback } from 'react';
import { dictionaryService } from '../../utils/DictionaryService';
import type { DictionaryEntry } from '../../utils/DictionaryService';

interface DictionaryContextType {
  activeEntry: DictionaryEntry | null;
  isLoading: boolean;
  position: { x: number; y: number } | null;
  show: (word: string, x: number, y: number) => void;
  hide: () => void;
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const DictionaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeEntry, setActiveEntry] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const show = useCallback(async (word: string, x: number, y: number) => {
    setPosition({ x, y });
    setIsLoading(true);
    setActiveEntry(null);

    const entry = await dictionaryService.lookup(word);
    if (entry) {
      setActiveEntry(entry);
    }
    setIsLoading(false);
  }, []);

  const hide = useCallback(() => {
    setActiveEntry(null);
    setPosition(null);
  }, []);

  return (
    <DictionaryContext.Provider value={{ activeEntry, isLoading, position, show, hide }}>
      {children}
      <DictionaryTooltip />
    </DictionaryContext.Provider>
  );
};

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) throw new Error('useDictionary must be used within DictionaryProvider');
  return context;
};

const DictionaryTooltip: React.FC = () => {
  const { activeEntry, isLoading, position } = useDictionary();

  if (!position) return null;

  return (
    <div style={{
      position: 'fixed',
      top: position.y - 10,
      left: position.x,
      transform: 'translate(-50%, -100%)',
      zIndex: 2000,
      width: '280px',
      background: 'white',
      borderRadius: 'var(--border-radius-lg)',
      boxShadow: 'var(--shadow-md), 0 10px 25px -5px rgba(0,0,0,0.1)',
      padding: '1.25rem',
      border: '1px solid var(--color-border-primary)',
      pointerEvents: 'none',
      animation: 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>
      {isLoading ? (
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>🔍 Searching...</div>
      ) : activeEntry ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <strong style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{activeEntry.word}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontStyle: 'italic' }}>{activeEntry.partOfSpeech}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
            {activeEntry.definition}
          </p>
          {activeEntry.synonyms.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Synonyms</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {activeEntry.synonyms.slice(0, 5).map((s, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'var(--color-background-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--color-border-primary)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {activeEntry.antonyms && activeEntry.antonyms.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Antonyms</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {activeEntry.antonyms.slice(0, 5).map((a, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: '#fff1f2', color: '#be123c', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #fecdd3' }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>No definition found.</div>
      )}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -90%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -100%) scale(1); }
        }
      `}</style>
    </div>
  );
};
