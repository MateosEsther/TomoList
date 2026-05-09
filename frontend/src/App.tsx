// Routes y Route definen qué componente se renderiza.
import { Routes, Route } from 'react-router'

// Páginas disponibles.
import HomePage from './pages/HomePage/HomePage'
import RegisterPage from './pages/RegisterPage/RegisterPage'

// App es el componente raíz de React. El return define las posibles rutas principales.

function App() {
    return (
        <Routes>
            {/*Ruta principal*/}
            <Route path="/" element={<HomePage />} />

            {/*Ruta registro*/}
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    )
}

export default App