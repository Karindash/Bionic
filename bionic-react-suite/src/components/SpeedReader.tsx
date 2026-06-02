import React, { useState, useEffect, useRef } from 'react';
import { useBionic, BionicWord } from '../hooks/useBionic';

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
    <div className="rsvp-container">
      <div className="rsvp-word-display">
        <span className="bionic-anchor focal-point">{currentWord.anchor}</span>
        <span className="bionic-rest">{currentWord.rest}{currentWord.suffix}</span>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', marginBottom: '1rem' }}>
        <div style={{ 
          height: '4px', 
          background: '#e0e0e0', 
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${(currentIndex / rsvpWords.length) * 100}%`, 
            height: '100%', 
            background: 'var(--color-primary)',
            transition: 'width 0.1s linear'
          }} />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem', textAlign: 'center' }}>
          {currentIndex} / {rsvpWords.length} words
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 10))}>-10</button>
        <button className="btn" onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button className="btn btn-secondary" onClick={() => setCurrentIndex(Math.min(rsvpWords.length - 1, currentIndex + 10))}>+10</button>
        <button className="btn btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.9rem' }}>Speed: {wpm} WPM</span>
        <input 
          type="range" 
          min="100" 
          max="800" 
          step="50" 
          value={wpm} 
          onChange={(e) => setWpm(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};
