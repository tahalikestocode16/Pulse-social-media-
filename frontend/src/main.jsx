import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

// ── Production API URL interceptor ──────────────────────────────
// Prepend Railway backend URL to relative fetch calls in production/build
const RAILWAY_BACKEND = "https://pulse-social-media-production.up.railway.app";
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? RAILWAY_BACKEND : '');

if (API_BASE) {
  const _originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/')) {
      input = API_BASE + input;
    }
    return _originalFetch(input, init);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
