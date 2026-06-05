import React, { useState, useRef } from 'react';
import { parseFile } from '../../utils/FileParser';

interface LibraryProps {
  onSelectFile: (text: string, title: string) => void;
}

interface Book {
  id: string;
  title: string;
  format: string;
  text: string;
  dateAdded: string;
}

export const Library: React.FC<LibraryProps> = ({ onSelectFile }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([
    { 
      id: '1', 
      title: 'Sample: Bionic Reading Guide', 
      format: 'PDF', 
      text: 'Bionic reading combines two powerful techniques to accelerate comprehension...', 
      dateAdded: 'Today' 
    }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const text = await parseFile(file);
      const newBook: Book = {
        id: Math.random().toString(36).substr(2, 9),
        title: file.name,
        format: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        text: text,
        dateAdded: new Date().toLocaleDateString()
      };
      setBooks(prev => [newBook, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Failed to parse file. Please ensure it is a valid PDF, EPUB, or MOBI.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Library</h2>
        <button 
          className="btn" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? '⌛ Parsing...' : '➕ Upload Book'}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".pdf,.epub,.mobi" 
          onChange={handleFileUpload}
        />
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--border-radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border-primary)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-tertiary)', display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr' }}>
          <span>Title</span>
          <span>Format</span>
          <span>Date Added</span>
          <span style={{ textAlign: 'right' }}>Actions</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {books.map((book) => (
            <div key={book.id} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border-primary)', display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', alignItems: 'center', transition: 'background 0.2s' }} className="library-item">
              <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{book.format === 'PDF' ? '📄' : '📚'}</span>
                {book.title}
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ padding: '0.2rem 0.5rem', background: 'var(--color-background-primary)', borderRadius: '4px', border: '1px solid var(--color-border-primary)', fontWeight: 600, fontSize: '0.75rem' }}>
                  {book.format}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>{book.dateAdded}</div>
              <div style={{ textAlign: 'right' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => onSelectFile(book.text, book.title)}
                >
                  Read
                </button>
              </div>
            </div>
          ))}

          {books.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
              Your library is empty. Upload a file to get started.
            </div>
          )}
        </div>
      </div>

      <style>{`
        .library-item:hover {
          background: var(--color-background-primary);
        }
        .library-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};
