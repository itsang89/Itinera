import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { APIProvider } from '@vis.gl/react-google-maps'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { env } from './lib/env'
import App from './App'
import './index.css'

const hasMapsKey = !!env.googleMapsApiKey
const app = (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {hasMapsKey ? (
      <APIProvider apiKey={env.googleMapsApiKey}>
        {app}
      </APIProvider>
    ) : (
      app
    )}
  </StrictMode>,
)
