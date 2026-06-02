import React, { useState } from 'react';
import './styles/theme.css';
import { SpeedReader } from './components/SpeedReader';
import { DocReader } from './components/DocReader';
import { BionicConverter } from './components/BionicConverter';
import { Dashboard } from './components/Dashboard';

const SAMPLE_TEXT = `Bionic reading combines two powerful techniques to accelerate comprehension. The first is rapid serial visual presentation (RSVP), which flashes words one at a time at a controlled pace. 

The second is bionic highlighting, which bolds the first portion of each word so your brain recognizes it faster. Together they reduce subvocalization and eye movement, letting you read at speeds previously impossible. 

Many readers report retaining more information because focus is enforced rather than optional. You can adjust the word-per-minute rate and the bionic ratio to find your personal sweet spot.`;

type View = 'dashboard' | 'rsvp' | 'doc' | 'converter';

export default function App() {
  const [activeTab, setActiveTab] = useState<View>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'rsvp':
        return <SpeedReader text={SAMPLE_TEXT} />;
      case 'doc':
        return <DocReader text={SAMPLE_TEXT} />;
      case 'converter':
        return <BionicConverter />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'rsvp': return 'RSVP Speed Reader';
      case 'doc': return 'Long-Form Reader';
      case 'converter': return 'Text Converter';
      default: return 'Bionic Reader';
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <span>Bionic Suite</span>
        </div>
        <nav>
          <ul className="nav-list">
            <li 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </li>
            <li 
              className={`nav-item ${activeTab === 'rsvp' ? 'active' : ''}`}
              onClick={() => setActiveTab('rsvp')}
            >
              🚀 Speed Reader
            </li>
            <li 
              className={`nav-item ${activeTab === 'doc' ? 'active' : ''}`}
              onClick={() => setActiveTab('doc')}
            >
              📖 Long-Form
            </li>
            <li 
              className={`nav-item ${activeTab === 'converter' ? 'active' : ''}`}
              onClick={() => setActiveTab('converter')}
            >
              🔄 Converter
            </li>
          </ul>
        </nav>
        
        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--border-radius-md)', fontSize: '0.8rem' }}>
          <div style={{ color: 'white', fontWeight: 600 }}>Pro Plan</div>
          <div style={{ color: 'var(--color-sidebar-text)' }}>Unlimited conversions</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{getTitle()}</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Alex Reader</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Premium User</div>
            </div>
            <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>AR</div>
          </div>
        </header>

        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
