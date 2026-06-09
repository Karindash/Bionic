import React from 'react';
import { Stat } from '../atoms/Stat';

interface StatsGridProps {
  stats: Array<{
    label: string;
    value: string | number;
    unit?: string;
  }>;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <Stat key={i} {...stat} />
      ))}
    </div>
  );
};
