import React from 'react';
import { NavItem } from '../molecules/NavItem';
import { Badge } from '../atoms/Badge';

export interface NavConfig<T extends string> {
  id: T;
  label: string;
  icon: string;
}

interface SidebarProps<T extends string> {
  activeId: T;
  onNavigate: (id: T) => void;
  navigation: NavConfig<T>[];
  logo?: {
    icon: string;
    text: string;
  };
  footer?: {
    title: string;
    subtitle: string;
    badge?: string;
  };
}

export function Sidebar<T extends string>({ 
  activeId, 
  onNavigate, 
  navigation,
  logo = { icon: '⚡', text: 'Bionic Suite' },
  footer
}: SidebarProps<T>) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{ fontSize: '1.5rem' }}>{logo.icon}</span>
        <span>{logo.text}</span>
      </div>
      <nav>
        <ul className="nav-list">
          {navigation.map((item) => (
            <NavItem 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              isActive={activeId === item.id} 
              onClick={() => onNavigate(item.id)} 
            />
          ))}
        </ul>
      </nav>
      
      {footer && (
        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--border-radius-md)', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ color: 'white', fontWeight: 600 }}>{footer.title}</span>
            {footer.badge && <Badge variant="secondary">{footer.badge}</Badge>}
          </div>
          <div style={{ color: 'var(--color-sidebar-text)' }}>{footer.subtitle}</div>
        </div>
      )}
    </aside>
  );
}
