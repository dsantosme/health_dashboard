import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provedor } from './lib/store'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provedor>
      <App />
    </Provedor>
  </StrictMode>,
)

// O service worker so entra no build de producao, para nao atrapalhar o dev.
if (import.meta.env.PROD && !import.meta.env.VITE_SINGLE && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined)
  })
}
