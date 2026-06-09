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

const parseEPUB = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const book = ePub(arrayBuffer);
  await book.ready;
  
  let fullText = '';
  // book.spine.items contains the sections of the book
  const items = (book.spine as any).items || [];
  
  for (const item of items) {
    try {
      const doc = await item.load(book.load.bind(book));
      // Use innerText if available (better for layout), fallback to textContent
      const text = doc.body ? doc.body.innerText : (doc.textContent || '');
      fullText += text + '\n\n';
      item.unload();
    } catch (e) {
      console.warn('Failed to load EPUB section:', e);
    }
  }

  return fullText;
};

const parseMOBI = async (file: File): Promise<string> => {
  // v0.4.6+ uses initMobiFile which returns a Mobi instance
  const { initMobiFile } = await import('@lingo-reader/mobi-parser');
  
  try {
    const mobi = await initMobiFile(file);
    const spine = mobi.getSpine();
    
    let fullText = '';
    for (const item of spine) {
      // Each spine item has an id that can be loaded
      const { html } = await mobi.loadChapter(item.id);
      
      // Convert HTML to plain text
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      fullText += (tempDiv.innerText || tempDiv.textContent || '') + '\n\n';
    }

    if (typeof mobi.destroy === 'function') {
      mobi.destroy();
    }

    return fullText;
  } catch (error) {
    console.error('MOBI parsing failed:', error);
    throw new Error('Failed to parse MOBI file. The format might be encrypted or corrupted.');
  }
};
