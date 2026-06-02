import React, { useState } from 'react';
import { useBionic } from '../hooks/useBionic';

export const BionicConverter: React.FC = () => {
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
    alert("Copied to clipboard!");
  };

  return (
    <div className="converter-grid">
      <div className="input-area">
        <label style={{ fontWeight: 600 }}>Input Plain Text</label>
        <textarea 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text..."
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem' }}>Bionic Ratio: {ratio}%</span>
          <input 
            type="range" 
            min="20" 
            max="60" 
            step="5" 
            value={ratio} 
            onChange={(e) => setRatio(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="output-area">
        <label style={{ fontWeight: 600 }}>Live Preview</label>
        <div className="output-preview">
          {processedWords.map((word, i) => {
            if (/^\s+$/.test(word.original)) return <span key={i}>{word.original}</span>;
            return (
              <span key={i}>
                <span className="bionic-anchor">{word.anchor}</span>
                <span>{word.rest}{word.suffix}</span>
              </span>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" onClick={() => copyToClipboard(generateHTML())}>Copy HTML</button>
          <button className="btn btn-secondary" onClick={() => copyToClipboard(generateMarkdown())}>Copy Markdown</button>
        </div>
      </div>
    </div>
  );
};
