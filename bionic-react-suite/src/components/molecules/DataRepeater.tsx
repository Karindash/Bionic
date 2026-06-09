import React from 'react';

interface DataRepeaterProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  gap?: string;
  className?: string;
}

export function DataRepeater<T>({ 
  items, 
  renderItem, 
  emptyState, 
  gap = '1rem',
  className = '' 
}: DataRepeaterProps<T>) {
  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div 
      className={className} 
      style={{ display: 'flex', flexDirection: 'column', gap }}
    >
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
}
