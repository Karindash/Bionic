import React from 'react';

interface ProgressProps {
  value: number; // 0 to 100
  height?: string;
  color?: string;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  height = '6px', 
  color = 'var(--color-primary)' 
}) => {
  return (
    <div style={{ 
      height, 
      background: 'var(--color-border-primary)', 
      borderRadius: 'calc(height / 2)',
      overflow: 'hidden',
      width: '100%'
    }}>
      <div style={{ 
        width: `${Math.min(100, Math.max(0, value))}%`, 
        height: '100%', 
        background: color,
        transition: 'width 0.1s linear'
      }} />
    </div>
  );
};
