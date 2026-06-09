import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth, 
  style, 
  className, 
  ...props 
}) => {
  const baseClass = variant === 'primary' ? 'btn' : 'btn btn-secondary';
  const customStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : undefined,
    ...style
  };

  return (
    <button 
      className={`${baseClass} ${className || ''}`} 
      style={customStyle} 
      {...props}
    >
      {children}
    </button>
  );
};
