import React, { useState } from 'react';
import './styles/theme.css';
import { SpeedReader } from './features/animated_reader/SpeedReader';
import { DocReader } from './features/file_handler/DocReader';
import { BionicConverter } from './features/master_feature/BionicConverter';
import { Dashboard } from './features/dashboard/Dashboard';
import { Library } from './features/file_handler/Library';
import { Sidebar, NavConfig } from './components/organisms/Sidebar';
import { Header } from './components/organisms/Header';

const SAMPLE_TEXT = `Bionic reading combines two powerful techniques to accelerate comprehension. The first is rapid serial visual presentation (RSVP), which flashes words one at a time at a controlled pace. 

The second is bionic highlighting, which bolds the first portion of each word so your brain recognizes it faster. Together they reduce subvocalization and eye movement, letting you read at speeds previously impossible. 

Many readers report retaining more information because focus is enforced rather than optional. You can adjust the word-per-minute rate and the bionic ratio to find your personal sweet spot.`;

type View = 'dashboard' | 'library' | 'rsvp' | 'doc' | 'converter';

export default function App() {
  const [activeTab, setActiveTab] = useState<View>('dashboard');
  const [currentText, setCurrentText] = useState(SAMPLE_TEXT);
  const [currentTitle, setCurrentTitle] = useState('Introduction to Bionic Reading');

  const navigation: NavConfig<View>[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'library', label: 'My Library', icon: '📚' },
    { id: 'rsvp', label: 'Speed Reader', icon: '🚀' },
    { id: 'doc', label: 'Long-Form', icon: '📖' },
    { id: 'converter', label: 'Converter', icon: '🔄' },
  ];

  const user = {
    name: 'Alex Reader',
    initials: 'AR',
    role: 'Premium User',
    avatarColor: 'var(--color-primary)'
  };

  const handleSelectFile = (text: string, title: string) => {
    setCurrentText(text);
    setCurrentTitle(title);
    setActiveTab('doc');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'library': return <Library onSelectFile={handleSelectFile} />;
      case 'rsvp': return <SpeedReader text={currentText} />;
      case 'doc': return <DocReader text={currentText} />;
      case 'converter': return <BionicConverter />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  const getTitle = () => {
    const activeNav = navigation.find(n => n.id === activeTab);
    if (activeTab === 'rsvp' || activeTab === 'doc') return currentTitle || activeNav?.label || 'Reader';
    return activeNav?.label || 'Bionic Reader';
  };

  return (
    <div className="app-layout">
      <Sidebar 
        activeId={activeTab} 
        onNavigate={setActiveTab} 
        navigation={navigation}
        footer={{
          title: 'Pro Plan',
          subtitle: 'Unlimited conversions',
          badge: 'Active'
        }}
      />

      <main className="main-content">
        <Header 
          title={getTitle()} 
          user={user}
        />

        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
