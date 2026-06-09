# Technical Design: Bionic Reader Suite

## 1. Tech Stack Details
- **Frontend Framework:** React 18 (Functional Components + Hooks).
- **Build Tool:** Vite (Fast Refresh, optimized builds).
- **Language:** TypeScript (Ensures data structures like `BionicWord` are consistent).
- **Styling:** Modern CSS (CSS Variables for themes, Flex/Grid for layout).
- **File Parsing:** 
  - `pdfjs-dist`: For client-side PDF extraction.
  - `epubjs`: For EPUB navigation and text extraction.
  - `@lingo-reader/mobi-parser`: For MOBI support.

## 2. Architecture & Data Flow
The application follows a **Unidirectional Data Flow**:

1. **Input Layer:** `FileParser.ts` or `TextArea` receives raw input (Binary file or string).
2. **Processing Layer:** 
   - `FileParser` converts binary to `string`.
   - `useBionic.ts` (Hook) takes the `string` + `ratio` and transforms it into an array of `BionicWord` objects.
3. **State Layer:** React state holds the current `processedWords`.
4. **View Layer:** Components map over `processedWords` to render `<span><b>{anchor}</b>{rest}</span>`.

### Data Structure: `BionicWord`
```typescript
interface BionicWord {
  original: string;   // Full part (including whitespace/punctuation)
  anchor: string;     // The bolded part (e.g., "Bion")
  rest: string;       // The remaining part (e.g., "ic")
  suffix: string;     // Punctuation following the word
  isPunctuation: boolean;
}
```

## 3. Scalability Considerations
- **Memory Management:** For large PDFs (100+ pages), do not process the entire text at once. Implement "Windowing" or "Lazy Loading" to process only the visible page.
- **Persistent Storage:** Use `localStorage` for user preferences (Ratio, Theme). Use `IndexedDB` (via `dexie.js`) if we decide to store full book texts locally to avoid re-parsing.
- **Global Accessibility:** Since this is a client-side app, it can be deployed to a CDN (Vercel/Netlify) and served globally with near-zero latency.

## 4. Evaluation Best Practices
- **Visual Regression:** Check if the bolding looks correct on different fonts.
- **Performance Profiling:** Use Chrome DevTools "Performance" tab to ensure the regex transformation doesn't freeze the UI on large texts.
- **Error Boundaries:** Wrap the `FileParser` calls in try/catch blocks to prevent the whole app from crashing if a file is corrupted.
