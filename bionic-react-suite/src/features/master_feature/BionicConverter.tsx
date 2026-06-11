import React, { useState } from 'react';
import { useBionic } from '../../hooks/useBionic';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { RangeInput } from '../../components/atoms/RangeInput';
import { BionicWord } from '../../components/molecules/BionicWord';

interface BionicConverterProps {
  onConvert?: () => void;
}

export const BionicConverter: React.FC<BionicConverterProps> = ({ onConvert }) => {
  const [inputText, setInputText] = useState("Paste your text here to convert it into Bionic Reading format. You can then copy the HTML or Markdown for use in your own documents or apps.");
  const [ratio, setRatio] = useState(40);
  const { processedWords } = useBionic(inputText, ratio);

  const generateHTML = () => {
    return processedWords.map(w => {
      if (/^\s+$/.test(w.original)) return w.original;
      return `<b>${w.anchor}</b>${w.rest}${w.suffix}`;
    }).join('');
  };

  const generateMarkdown = () => {
    return processedWords.map(w => {
      if (/^\s+$/.test(w.original)) return w.original;
      return `**${w.anchor}**${w.rest}${w.suffix}`;
    }).join('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if (onConvert) onConvert();
    alert("Copied to clipboard!");
  };

  return (
    <Card padding="0">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Text Converter</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '200px' }}>
          <RangeInput 
            label="Ratio" 
            value={ratio} 
            min={20} 
            max={60} 
            step={5} 
            unit="%" 
            onChange={setRatio} 
          />
        </div>
      </div>
      
      <div className="converter-grid" style={{ padding: '1.5rem' }}>
        <div className="input-area">
          <label style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Input Plain Text</label>
          <textarea 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text..."
            style={{ boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)', border: '1px solid var(--color-border-primary)' }}
          />
        </div>

        <div className="output-area">
          <label style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Bionic Preview</label>
          <div className="output-preview" style={{ background: 'var(--color-background-primary)', border: '1px solid var(--color-border-primary)' }}>
            {processedWords.map((word, i) => {
              if (/^\s+$/.test(word.original)) return <span key={i}>{word.original}</span>;
              return (
                <BionicWord 
                  key={i} 
                  anchor={word.anchor} 
                  rest={word.rest} 
                  suffix={word.suffix} 
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button fullWidth onClick={() => copyToClipboard(generateHTML())}>Copy HTML</Button>
            <Button variant="secondary" fullWidth onClick={() => copyToClipboard(generateMarkdown())}>Copy Markdown</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
