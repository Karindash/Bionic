import React from 'react';

interface RangeInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const RangeInput: React.FC<RangeInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700 }}>{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        style={{ width: '100%', accentColor: 'var(--color-primary)' }}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
};
