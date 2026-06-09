import React from 'react';

interface BionicWordProps {
  anchor: string;
  rest: string;
  suffix: string;
  isFocal?: boolean;
}

export const BionicWord: React.FC<BionicWordProps> = ({ anchor, rest, suffix, isFocal }) => {
  return (
    <span className={`bionic-word ${isFocal ? 'focal-point' : ''}`}>
      <span className="bionic-anchor">{anchor}</span>
      <span className="bionic-rest">{rest}{suffix}</span>
    </span>
  );
};
