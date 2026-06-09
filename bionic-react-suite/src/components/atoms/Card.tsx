import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, padding = '1.5rem', className = '', style }) => {
  return (
    <div 
      className={`card ${className}`} 
      style={{ padding, ...style }}
    >
      {children}
    </div>
  );
};
