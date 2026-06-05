import React, { useState, useEffect, useRef } from 'react';
import { useBionic, BionicWord } from '../../hooks/useBionic';

interface SpeedReaderProps {
  text: string;
}

export const SpeedReader: React.FC<SpeedReaderProps> = ({ text }) => {
  const [wpm, setWpm] = useState(250);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { processedWords } = useBionic(text);
  
  // Filter out whitespace-only "words" for RSVP
  const rsvpWords = processedWords.filter(w => !/^\s+$/.test(w.original));
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentIndex < rsvpWords.length) {
      const currentWord = rsvpWords[currentIndex];
      let delay = (60 * 1000) / wpm;

      // Add punctuation pauses
      if (currentWord.suffix.includes('.') || currentWord.suffix.includes('!') || currentWord.suffix.includes('?')) {
        delay += 150;
      } else if (currentWord.suffix.includes(',') || currentWord.suffix.includes(';')) {
        delay += 75;
      }

      timerRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, delay);
    } else if (currentIndex >= rsvpWords.length) {
      setIsPlaying(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, wpm, rsvpWords]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const currentWord = rsvpWords[currentIndex] || { anchor: '', rest: '', suffix: '' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="rsvp-container" style={{ background: 'var(--color-background-secondary)', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
        <div className="rsvp-word-display">
          <span className="bionic-anchor focal-point">{currentWord.anchor}</span>
          <span className="bionic-rest">{currentWord.rest}{currentWord.suffix}</span>
        </div>

        <div style={{ width: '100%', maxWidth: '500px', marginBottom: '2rem' }}>
          <div style={{ 
            height: '6px', 
            background: 'var(--color-border-primary)', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(currentIndex / rsvpWords.length) * 100}%`, 
              height: '100%', 
              background: 'var(--color-primary)',
              transition: 'width 0.1s linear'
            }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', marginTop: '0.75rem', textAlign: 'center', fontWeight: 500 }}>
            {currentIndex} / {rsvpWords.length} words completed
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" style={{ padding: '0.75rem' }} onClick={() => setCurrentIndex(Math.max(0, currentIndex - 10))}>
            ↺ 10
          </button>
          <button className="btn" style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem' }} onClick={togglePlay}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button className="btn btn-secondary" style={{ padding: '0.75rem' }} onClick={() => setCurrentIndex(Math.min(rsvpWords.length - 1, currentIndex + 10))}>
            10 ↻
          </button>
          <button className="btn btn-secondary" style={{ padding: '0.75rem' }} onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Reading Speed</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 700 }}>{wpm} WPM</span>
            </div>
            <input 
              type="range" 
              className="w-full"
              min="100" 
              max="800" 
              step="50" 
              value={wpm} 
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              onChange={(e) => setWpm(parseInt(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.85rem' }}>
            <span style={{ marginRight: '0.5rem' }}>💡</span>
            Average reading speed is 200-250 WPM. Bionic reading allows for 400+ WPM with practice.
          </div>
        </div>
      </div>
    </div>
  );
};
