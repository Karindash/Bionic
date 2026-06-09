import React from 'react';

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <li 
      className={`nav-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span style={{ marginRight: '0.75rem' }}>{icon}</span>
      {label}
    </li>
  );
};
