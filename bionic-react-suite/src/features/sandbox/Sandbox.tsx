import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';
import { parseFile } from '../../utils/FileParser';
import { DocReader } from '../file_handler/DocReader';

export const Sandbox: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);
    setError(null);
    setContent(null);

    try {
      const text = await parseFile(selectedFile);
      setContent(text);
    } catch (err: any) {
      setError(err.message || 'Failed to parse file');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="sandbox-header">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>🧪 Feature Sandbox</h2>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem' }}>
          Test file parsing and readability in real-time. Files uploaded here are not saved to your library.
        </p>
      </div>

      <Card style={{ border: '2px dashed var(--color-border-primary)', background: 'var(--color-background-primary)' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📥</div>
          <h3 style={{ marginBottom: '1rem' }}>Upload for Instant Preview</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', marginBottom: '1.5rem' }}>
            Supports PDF, EPUB, MOBI, and AZW3. (Max 50MB)
          </p>
          
          <input 
            type="file" 
            id="sandbox-upload" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
            accept=".pdf,.epub,.mobi,.azw3"
          />
          
          <label htmlFor="sandbox-upload">
            <Button as="span" style={{ pointerEvents: 'none' }}>
              {isParsing ? 'Processing...' : 'Choose File'}
            </Button>
          </label>

          {file && (
            <div style={{ marginTop: '1rem' }}>
              <Badge variant="outline">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </Badge>
            </div>
          )}
        </div>
      </Card>

      {error && (
        <Card style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c' }}>
          <strong>Error:</strong> {error}
        </Card>
      )}

      {content && (
        <div className="sandbox-preview">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Parsed Result</h3>
            <Badge variant="secondary">Live Preview</Badge>
          </div>
          
          <DocReader text={content} />
        </div>
      )}

      {!content && !isParsing && !error && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-tertiary)', opacity: 0.5 }}>
          Waiting for file upload...
        </div>
      )}
    </div>
  );
};
