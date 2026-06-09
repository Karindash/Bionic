import React from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { StatsGrid } from '../../components/molecules/StatsGrid';
import { DataRepeater } from '../../components/molecules/DataRepeater';

type View = 'dashboard' | 'library' | 'rsvp' | 'doc' | 'converter';

interface DashboardProps {
  onNavigate: (tab: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Words Read', value: '12,482', trend: { value: '12%', isPositive: true }, variant: 'primary' as const },
    { label: 'Avg. Speed', value: 450, unit: 'WPM', trend: { value: '5%', isPositive: true }, variant: 'success' as const },
    { label: 'Reading Time', value: 4.2, unit: 'hrs', trend: { value: '2%', isPositive: false }, variant: 'default' as const },
    { label: 'Focus Score', value: '94%', variant: 'warning' as const }
  ];

  const recentActivity = [
    { title: 'The Art of War - Chapter 1', date: '2 hours ago', type: 'Doc' },
    { title: 'Deep Work Summary', date: 'Yesterday', type: 'RSVP' },
    { title: 'React Documentation', date: '3 days ago', type: 'Doc' }
  ];

  const quickActions = [
    { label: 'Open My Library', icon: '📚', target: 'library' as View },
    { label: 'Start RSVP Reader', icon: '🚀', target: 'rsvp' as View },
    { label: 'Open Doc Reader', icon: '📖', target: 'doc' as View }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Overview</h2>
      
      <StatsGrid stats={stats} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <Card>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Activity</h3>
          <DataRepeater 
            items={recentActivity}
            renderItem={(item, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingBottom: '0.75rem', 
                  borderBottom: i < recentActivity.length - 1 ? '1px solid var(--color-border-primary)' : 'none' 
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{item.date} • {item.type}</div>
                </div>
                <Button variant="secondary" onClick={() => onNavigate('doc')} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                  Open
                </Button>
              </div>
            )}
          />
        </Card>

        <Card style={{ background: 'var(--color-primary)', color: 'white' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Quick Actions</h3>
          <DataRepeater 
            items={quickActions}
            gap="0.75rem"
            renderItem={(action, i) => (
              <Button 
                key={i}
                style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left', justifyContent: 'flex-start' }}
                onClick={() => onNavigate(action.target)}
              >
                {action.icon} {action.label}
              </Button>
            )}
          />
        </Card>
      </div>
    </div>
  );
};
