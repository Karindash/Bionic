import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--color-primary)',
      color: 'white',
      padding: '0.2rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase'
    },
    secondary: {
      background: 'rgba(255,255,255,0.1)',
      color: 'white',
      padding: '0.2rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: 600
    },
    outline: {
      border: '1px solid var(--color-border-primary)',
      color: 'var(--color-text-tertiary)',
      padding: '0.2rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.7rem'
    }
  };

  return (
    <span style={styles[variant]}>
      {children}
    </span>
  );
};
