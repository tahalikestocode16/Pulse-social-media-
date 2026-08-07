import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

// ── Production API URL interceptor ──────────────────────────────
// In dev, Vite proxies all /auth, /posts, etc. to localhost:8080.
// In production on Vercel, we prepend VITE_API_URL (Railway backend URL)
// so every relative fetch("/posts/...") automatically hits the right server.
const API_BASE = import.meta.env.VITE_API_URL || '';

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
