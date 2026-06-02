import React, { useState } from 'react';
import './styles/theme.css';
import { SpeedReader } from './components/SpeedReader';
import { DocReader } from './components/DocReader';
import { BionicConverter } from './components/BionicConverter';

const SAMPLE_TEXT = `Bionic reading combines two powerful techniques to accelerate comprehension. The first is rapid serial visual presentation (RSVP), which flashes words one at a time at a controlled pace. 

The second is bionic highlighting, which bolds the first portion of each word so your brain recognizes it faster. Together they reduce subvocalization and eye movement, letting you read at speeds previously impossible. 

Many readers report retaining more information because focus is enforced rather than optional. You can adjust the word-per-minute rate and the bionic ratio to find your personal sweet spot.`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'rsvp' | 'doc' | 'converter'>('rsvp');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border-primary)', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Bionic React Suite</h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={`btn ${activeTab === 'rsvp' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('rsvp')}
          >
            RSVP Speed Reader
          </button>
          <button 
            className={`btn ${activeTab === 'doc' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('doc')}
          >
            Long-Form Reader
          </button>
          <button 
            className={`btn ${activeTab === 'converter' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('converter')}
          >
            Text Converter
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'rsvp' && <SpeedReader text={SAMPLE_TEXT} />}
        {activeTab === 'doc' && <DocReader text={SAMPLE_TEXT} />}
        {activeTab === 'converter' && <BionicConverter />}
      </main>

      <footer style={{ marginTop: '4rem', fontSize: '0.8rem', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
        Built with React + Bionic Reading Principles
      </footer>
    </div>
  );
}
