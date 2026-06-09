import React, { useState } from 'react';
import { useBionic } from '../../hooks/useBionic';
import { Card } from '../../components/atoms/Card';
import { RangeInput } from '../../components/atoms/RangeInput';
import { BionicWord } from '../../components/molecules/BionicWord';

interface DocReaderProps {
  text: string;
}

export const DocReader: React.FC<DocReaderProps> = ({ text }) => {
  const [ratio, setRatio] = useState(40);
  const { processedWords } = useBionic(text, ratio);

  return (
    <Card className="doc-container" style={{ background: 'white', padding: '3rem' }}>
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-background-primary)', padding: '1rem 1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, maxWidth: '300px' }}>
          <RangeInput 
            label="Bionic Ratio" 
            value={ratio} 
            min={20} 
            max={70} 
            step={5} 
            unit="%" 
            onChange={setRatio} 
          />
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
              <BionicWord 
                anchor={word.anchor} 
                rest={word.rest} 
                suffix={word.suffix} 
              />
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
    </Card>
  );
};
