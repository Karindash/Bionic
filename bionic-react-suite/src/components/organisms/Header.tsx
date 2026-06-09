import React from 'react';

interface HeaderProps {
  title: string;
  user: {
    name: string;
    initials: string;
    role: string;
    avatarColor?: string;
  };
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, user, actions }) => {
  return (
    <header className="top-header">
      <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</h1>
      
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {actions && <div className="header-actions">{actions}</div>}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{user.role}</div>
          </div>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: user.avatarColor || 'var(--color-primary)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontWeight: 700, 
            fontSize: '0.8rem' 
          }}>
            {user.initials}
          </div>
        </div>
      </div>
    </header>
  );
};
