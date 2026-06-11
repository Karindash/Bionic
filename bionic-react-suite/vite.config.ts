import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lingo-reader/mobi-parser': path.resolve(__dirname, 'node_modules/@lingo-reader/mobi-parser/dist/index.browser.mjs'),
      'epubjs': path.resolve(__dirname, 'node_modules/epubjs/dist/epub.min.js'),
    },
  },
})
