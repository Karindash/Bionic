import React from 'react';
import { useDictionary } from './DictionaryProvider';

interface BionicWordProps {
  anchor: string;
  rest: string;
  suffix: string;
  isFocal?: boolean;
}

export const BionicWord: React.FC<BionicWordProps> = ({ anchor, rest, suffix, isFocal }) => {
  const { show, hide } = useDictionary();

  const handleMouseEnter = (e: React.MouseEvent) => {
    const word = `${anchor}${rest}`;
    if (word.length > 2) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      show(word, x, y);
    }
  };

  return (
    <span 
      className={`bionic-word ${isFocal ? 'focal-point' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={hide}
    >
      <span className="bionic-anchor">{anchor}</span>
      <span className="bionic-rest">{rest}{suffix}</span>
    </span>
  );
};
