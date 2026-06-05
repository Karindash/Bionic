import React, { useState } from 'react';
import { useBionic } from '../../hooks/useBionic';

interface DocReaderProps {
  text: string;
}

export const DocReader: React.FC<DocReaderProps> = ({ text }) => {
  const [ratio, setRatio] = useState(40);
  const [focusLine, setFocusLine] = useState<number | null>(null);
  const { processedWords } = useBionic(text, ratio);

  // Group words into paragraphs based on double newlines in original text
  // For simplicity here, we'll just render it as a single block but respect original whitespace
  
  return (
    <div className="doc-container" style={{ background: 'white', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', padding: '3rem' }}>
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-background-primary)', padding: '1rem 1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, maxWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Bionic Ratio</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700 }}>{ratio}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="70" 
              step="5" 
              value={ratio} 
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              onChange={(e) => setRatio(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
          ✨ Optimized for focus
        </div>
      </div>

      <article style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', lineHeight: '2' }}>
        {processedWords.map((word, i) => {
          if (/^\s+$/.test(word.original)) {
            if (word.original.includes('\n\n')) {
              return <div key={i} style={{ height: '1.5rem' }} />;
            }
            return <span key={i}>{word.original}</span>;
          }

          return (
            <span key={i} className="word-wrapper">
              <span className="bionic-anchor" style={{ color: 'var(--color-text-primary)' }}>{word.anchor}</span>
              <span className="bionic-rest">{word.rest}{word.suffix}</span>
            </span>
          );
        })}
      </article>

      <style>{`
        .word-wrapper {
          display: inline-block;
          margin-right: 0.1em;
          transition: transform 0.2s;
        }
        .word-wrapper:hover {
          transform: translateY(-1px);
          color: var(--color-primary);
        }
      `}</style>
    </div>
  );
};
