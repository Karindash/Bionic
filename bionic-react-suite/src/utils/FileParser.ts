import * as pdfjsLib from 'pdfjs-dist';
import ePub from 'epubjs';
// Mobi parser will be dynamically imported in parseMOBI to avoid incorrect static imports

// Set up PDF.js worker
// In a real Vite project, you might need to use a CDN or a local worker file
// For this environment, we'll try to use the standard worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return await parsePDF(file);
    case 'epub':
      return await parseEPUB(file);
    case 'mobi':
    case 'azw3':
      return await parseMOBI(file);
    default:
      throw new Error('Unsupported file format');
  }
};

const parsePDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + '\n\n';
  }

  return fullText;
};

const htmlToPlainText = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Replace block elements with placeholders to preserve structure
  const blocks = ['p', 'div', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr'];
  blocks.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach(el => {
      const newline = document.createTextNode('\n\n');
      el.parentNode?.insertBefore(newline, el.nextSibling);
    });
  });

  return doc.body.innerText || doc.body.textContent || '';
};

const parseEPUB = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const book = ePub(arrayBuffer);
  await book.ready;
  
  let fullText = '';
  // epubjs spine handling
  const items = (book.spine as any).items || [];
  
  for (const item of items) {
    try {
      const doc = await item.load(book.load.bind(book));
      const html = doc.body ? doc.body.innerHTML : (doc.innerHTML || '');
      fullText += htmlToPlainText(html) + '\n\n';
      item.unload();
    } catch (e) {
      console.warn('Failed to load EPUB section:', e);
    }
  }

  return fullText;
};

const parseMOBI = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  try {
    const { initMobiFile, initKf8File } = await import('@lingo-reader/mobi-parser');
    
    // Convert to Uint8Array as it is the most reliable binary format for parsers
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    
    // Initialize the appropriate parser
    const mobi = (extension === 'azw3') 
      ? await initKf8File(data) 
      : await initMobiFile(data);

    if (!mobi) {
      throw new Error('Failed to initialize MOBI parser');
    }

    const spine = mobi.getSpine();
    let fullText = '';
    
    for (const item of spine) {
      try {
        const chapter = await mobi.loadChapter(item.id);
        if (chapter && chapter.html) {
          fullText += htmlToPlainText(chapter.html) + '\n\n';
        }
      } catch (itemError) {
        console.warn(`Failed to load chapter ${item.id}:`, itemError);
      }
    }

    if (typeof (mobi as any).destroy === 'function') {
      (mobi as any).destroy();
    }

    return fullText;
  } catch (error) {
    console.error('MOBI/KF8 parsing failed:', error);
    throw new Error('Failed to read MOBI/AZW3 content. The file might be corrupted or in an unsupported Kindle format.');
  }
};
