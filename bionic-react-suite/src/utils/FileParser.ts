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
  const spine = await book.spine;
  
  // Iterate through spine items to extract text
  // This is a simplified version, EPUBs are complex
  for (const item of spine.items) {
    const doc = await item.load(book.load.bind(book));
    if (doc instanceof Document) {
      fullText += doc.body.innerText + '\n\n';
    }
    item.unload();
  }

  return fullText;
};

const parseMOBI = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();

  // Dynamically import the mobi parser and try a few common export names
  const mod = await import('@lingo-reader/mobi-parser');
  const ParserClass: any = mod.default || mod.MobiParser || mod.EBookParser || mod.Parser;

  if (!ParserClass) {
    throw new Error('MOBI parser not found in @lingo-reader/mobi-parser');
  }

  // Some libraries expect the raw buffer, others expect an object; try to handle common APIs
  let content: any;
  try {
    const parserInstance = new ParserClass(arrayBuffer);
    if (typeof parserInstance.parse === 'function') {
      content = await parserInstance.parse();
    } else if (typeof parserInstance.get === 'function') {
      content = await parserInstance.get();
    }
  } catch (e) {
    // Fallback: maybe the parser exposes a parse function directly
    if (typeof ParserClass.parse === 'function') {
      content = await ParserClass.parse(arrayBuffer);
    } else {
      throw e;
    }
  }

  // Convert HTML content to plain text
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = (content && (content.html || content.content || content.body)) || '';
  return tempDiv.innerText || tempDiv.textContent || '';
};
