import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DictionaryProvider } from './components/molecules/DictionaryProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DictionaryProvider>
      <App />
    </DictionaryProvider>
  </React.StrictMode>,
)
