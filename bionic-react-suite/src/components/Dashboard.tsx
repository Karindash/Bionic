import React from 'react';

interface DashboardProps {
  onNavigate: (tab: 'rsvp' | 'doc' | 'converter') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Words Read</div>
          <div className="stat-value">12,482</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Speed</div>
          <div className="stat-value">450 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-text-tertiary)' }}>WPM</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Reading Time</div>
          <div className="stat-value">4.2 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-text-tertiary)' }}>hrs</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Focus Score</div>
          <div className="stat-value">94%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { title: 'The Art of War - Chapter 1', date: '2 hours ago', type: 'Doc' },
              { title: 'Deep Work Summary', date: 'Yesterday', type: 'RSVP' },
              { title: 'React Documentation', date: '3 days ago', type: 'Doc' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: i < 2 ? '1px solid var(--color-border-primary)' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>{item.date} • {item.type}</div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>Open</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'var(--color-primary)', color: 'white' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              className="btn" 
              style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => onNavigate('rsvp')}
            >
              🚀 Start RSVP Reader
            </button>
            <button 
              className="btn" 
              style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => onNavigate('doc')}
            >
              📖 Open Doc Reader
            </button>
            <button 
              className="btn" 
              style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => onNavigate('converter')}
            >
              🔄 Text Converter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
