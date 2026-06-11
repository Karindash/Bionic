import React, { useState, useEffect } from 'react';
import './styles/theme.css';
import { SpeedReader } from './features/animated_reader/SpeedReader';
import { DocReader } from './features/file_handler/DocReader';
import { BionicConverter } from './features/master_feature/BionicConverter';
import { Dashboard } from './features/dashboard/Dashboard';
import { Library } from './features/file_handler/Library';
import { Sandbox } from './features/sandbox/Sandbox';
import { Sidebar, NavConfig } from './components/organisms/Sidebar';
import { Header } from './components/organisms/Header';
import { storage, STORAGE_KEYS } from './utils/storage';
import { View, Book, Activity } from './types';

const SAMPLE_TEXT = `Bionic reading combines two powerful techniques to accelerate comprehension. The first is rapid serial visual presentation (RSVP), which flashes words one at a time at a controlled pace. 

The second is bionic highlighting, which bolds the first portion of each word so your brain recognizes it faster. Together they reduce subvocalization and eye movement, letting you read at speeds previously impossible. 

Many readers report retaining more information because focus is enforced rather than optional. You can adjust the word-per-minute rate and the bionic ratio to find your personal sweet spot.`;

export default function App() {
  const [activeTab, setActiveTab] = useState<View>('dashboard');
  const [currentText, setCurrentText] = useState(SAMPLE_TEXT);
  const [currentTitle, setCurrentTitle] = useState('Introduction to Bionic Reading');
  
  // Persistent States
  const [books, setBooks] = useState<Book[]>(() => storage.load(STORAGE_KEYS.BOOKS, []));
  const [recentActivities, setRecentActivities] = useState<Activity[]>(() => storage.load(STORAGE_KEYS.RECENT_ACTIVITY, []));

  useEffect(() => {
    storage.save(STORAGE_KEYS.BOOKS, books);
  }, [books]);

  useEffect(() => {
    storage.save(STORAGE_KEYS.RECENT_ACTIVITY, recentActivities);
  }, [recentActivities]);

  const addActivity = (title: string, type: Activity['type']) => {
    const newActivity: Activity = {
      title,
      type,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };
    setRecentActivities(prev => [newActivity, ...prev].slice(0, 10)); // Keep last 10
  };

  const handleSelectFile = (text: string, title: string) => {
    setCurrentText(text);
    setCurrentTitle(title);
    setActiveTab('doc');
    addActivity(title, 'Doc');
  };

  const navigation: NavConfig<View>[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'library', label: 'My Library', icon: '📚' },
    { id: 'rsvp', label: 'Speed Reader', icon: '🚀' },
    { id: 'doc', label: 'Long-Form', icon: '📖' },
    { id: 'converter', label: 'Converter', icon: '🔄' },
    { id: 'sandbox', label: 'Sandbox', icon: '🧪' },
  ];

  const user = {
    name: 'Alex Reader',
    initials: 'AR',
    role: 'Premium User',
    avatarColor: 'var(--color-primary)'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard onNavigate={setActiveTab} recentActivities={recentActivities} />;
      case 'library': 
        return <Library books={books} setBooks={setBooks} onSelectFile={handleSelectFile} />;
      case 'rsvp': 
        return <SpeedReader text={currentText} onComplete={() => addActivity(currentTitle, 'RSVP')} />;
      case 'doc': 
        return <DocReader text={currentText} onComplete={() => addActivity(currentTitle, 'Doc')} />;
      case 'converter': 
        return <BionicConverter onConvert={() => addActivity('Text Conversion', 'Converter')} />;
      case 'sandbox': 
        return <Sandbox />;
      default: 
        return <Dashboard onNavigate={setActiveTab} recentActivities={recentActivities} />;
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
