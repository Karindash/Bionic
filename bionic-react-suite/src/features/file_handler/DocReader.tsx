import React, { useState, useEffect, useMemo } from 'react';
import { useBionic } from '../../hooks/useBionic';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { RangeInput } from '../../components/atoms/RangeInput';
import { BionicWord } from '../../components/molecules/BionicWord';
import { Progress } from '../../components/atoms/Progress';

interface DocReaderProps {
  text: string;
  onComplete?: () => void;
}

const WORDS_PER_PAGE = 250;
const AUTO_ADVANCE_TIME = 10000; // 10 seconds

export const DocReader: React.FC<DocReaderProps> = ({ text, onComplete }) => {
  const [ratio, setRatio] = useState(40);
  const [currentPage, setCurrentPage] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { processedWords } = useBionic(text, ratio);

  // Split words into pages
  const pages = useMemo(() => {
    const p: any[][] = [];
    for (let i = 0; i < processedWords.length; i += WORDS_PER_PAGE) {
      p.push(processedWords.slice(i, i + WORDS_PER_PAGE));
    }
    return p;
  }, [processedWords]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoAdvance && currentPage < pages.length - 1) {
      timer = setTimeout(() => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
        
        if (nextPage === pages.length - 1 && onComplete) {
          onComplete();
        }
      }, AUTO_ADVANCE_TIME);
    }
    return () => clearTimeout(timer);
  }, [autoAdvance, currentPage, pages.length, onComplete]);

  const currentWords = pages[currentPage] || [];
  const progressPercent = ((currentPage + 1) / pages.length) * 100;

  return (
    <div style={{ position: 'relative' }}>
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'var(--color-primary)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: 'var(--border-radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          📄 Page {currentPage + 1}
        </div>
      )}

      <Card className="doc-container" style={{ background: 'white', padding: '3rem', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-background-primary)', padding: '1rem 1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border-primary)', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, maxWidth: '250px' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button 
              variant={autoAdvance ? 'primary' : 'secondary'} 
              onClick={() => setAutoAdvance(!autoAdvance)}
              style={{ fontSize: '0.85rem' }}
            >
              {autoAdvance ? '⏸ Auto: ON' : '▶ Auto: OFF'}
            </Button>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', width: '100px', textAlign: 'center' }}>
              Page {currentPage + 1} / {pages.length}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>←</Button>
            <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === pages.length - 1}>→</Button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <Progress value={progressPercent} height="4px" />
        </div>

        <article style={{ 
          fontSize: '1.25rem', 
          color: 'var(--color-text-secondary)', 
          lineHeight: '2', 
          flex: 1,
          textAlign: 'justify',
          hyphens: 'auto',
          wordBreak: 'break-word'
        }}>
          {currentWords.map((word, i) => {
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

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>
          {autoAdvance && `Next page in ${AUTO_ADVANCE_TIME / 1000}s...`}
        </div>
      </Card>

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
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
