// StrictMode ayuda a que React pueda detectar problemas durante el desarrollo.
import { StrictMode } from 'react'
// createRoot función que conecta React con el HTML real del navegador.
import { createRoot } from 'react-dom/client'
// Para la gestión de la navegación de React Router según la URL del navegador.
import { BrowserRouter } from 'react-router'
// Importam los estilos globales.
import './styles/main.scss'
// Importa el componente principal.
import App from './App.tsx'

// Busca el elemento con id="root" en index.html y monta dentro de él toda la aplicación React.
// BrowserRouter envuelve App para que App y todas las páginas hijas usen rutas funcionales en toda la aplicación web.
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)