import React from 'react';

interface StatProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export const Stat: React.FC<StatProps> = ({ 
  label, 
  value, 
  unit, 
  trend,
  variant = 'default' 
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { borderLeft: '4px solid var(--color-primary)' },
    success: { borderLeft: '4px solid #10b981' },
    warning: { borderLeft: '4px solid #f59e0b' },
    default: {}
  };

  return (
    <div className="stat-card" style={variantStyles[variant]}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {unit && <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-text-tertiary)' }}> {unit}</span>}
      </div>
      {trend && (
        <div style={{ 
          fontSize: '0.75rem', 
          marginTop: '0.5rem', 
          color: trend.isPositive ? '#10b981' : '#ef4444',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
          <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}> vs last month</span>
        </div>
      )}
    </div>
  );
};
