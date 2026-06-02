import React, { useState } from 'react';
import { useBionic } from '../hooks/useBionic';

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
    <div className="doc-container">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-background-secondary)', padding: '1rem', borderRadius: 'var(--border-radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Bionic Ratio: {ratio}%</span>
          <input 
            type="range" 
            min="20" 
            max="70" 
            step="5" 
            value={ratio} 
            onChange={(e) => setRatio(parseInt(e.target.value))}
          />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
          Tip: Hover over text to dim surrounding lines
        </div>
      </div>

      <article onMouseLeave={() => setFocusLine(null)}>
        {processedWords.map((word, i) => {
          if (/^\s+$/.test(word.original)) {
            // Handle multiple newlines as paragraph breaks
            if (word.original.includes('\n\n')) {
              return <br key={i} />;
            }
            return <span key={i}>{word.original}</span>;
          }

          return (
            <span key={i} className="word-wrapper">
              <span className="bionic-anchor">{word.anchor}</span>
              <span className="bionic-rest">{word.rest}{word.suffix}</span>
            </span>
          );
        })}
      </article>

      <style>{`
        .word-wrapper {
          display: inline-block;
          margin-right: 0.1em;
        }
      `}</style>
    </div>
  );
};
