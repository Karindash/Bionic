import React, { useState, useEffect, useRef } from 'react';
import { useBionic } from '../../hooks/useBionic';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Progress } from '../../components/atoms/Progress';
import { RangeInput } from '../../components/atoms/RangeInput';
import { BionicWord } from '../../components/molecules/BionicWord';

interface SpeedReaderProps {
  text: string;
}

export const SpeedReader: React.FC<SpeedReaderProps> = ({ text }) => {
  const [wpm, setWpm] = useState(250);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { processedWords } = useBionic(text);
  
  const rsvpWords = processedWords.filter(w => !/^\s+$/.test(w.original));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentIndex < rsvpWords.length) {
      const currentWord = rsvpWords[currentIndex];
      let delay = (60 * 1000) / wpm;

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
  const progressPercent = (currentIndex / rsvpWords.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="rsvp-container" style={{ background: 'var(--color-background-secondary)', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
        <div className="rsvp-word-display">
          <BionicWord 
            anchor={currentWord.anchor} 
            rest={currentWord.rest} 
            suffix={currentWord.suffix} 
            isFocal 
          />
        </div>

        <div style={{ width: '100%', maxWidth: '500px', marginBottom: '2rem' }}>
          <Progress value={progressPercent} />
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', marginTop: '0.75rem', textAlign: 'center', fontWeight: 500 }}>
            {currentIndex} / {rsvpWords.length} words completed
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="secondary" style={{ padding: '0.75rem' }} onClick={() => setCurrentIndex(Math.max(0, currentIndex - 10))}>
            ↺ 10
          </Button>
          <Button style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem' }} onClick={togglePlay}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </Button>
          <Button variant="secondary" style={{ padding: '0.75rem' }} onClick={() => setCurrentIndex(Math.min(rsvpWords.length - 1, currentIndex + 10))}>
            10 ↻
          </Button>
          <Button variant="secondary" style={{ padding: '0.75rem' }} onClick={reset}>Reset</Button>
        </div>
      </div>

      <Card>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <RangeInput 
            label="Reading Speed" 
            value={wpm} 
            min={100} 
            max={800} 
            step={50} 
            unit=" WPM" 
            onChange={setWpm} 
          />
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.85rem' }}>
            <span style={{ marginRight: '0.5rem' }}>💡</span>
            Average reading speed is 200-250 WPM. Bionic reading allows for 400+ WPM with practice.
          </div>
        </div>
      </Card>
    </div>
  );
};
