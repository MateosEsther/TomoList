// Routes y Route definen qué componente se renderiza.
import { Routes, Route } from 'react-router'

// Páginas disponibles.
import HomePage from './pages/HomePage/HomePage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'
import MyListsPage from './pages/MyListsPage/MyListsPage'

// App es el componente raíz de React. El return define las posibles rutas principales.

function App() {
    return (
        <Routes>
            {/*Ruta principal.*/}
            <Route path="/" element={<HomePage />} />

            {/*Ruta registro.*/}
            <Route path="/register" element={<RegisterPage />} />

            {/*Ruta de recuperación de contraseña.*/}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/*Ruta a mis listas.*/}
            <Route path="/mis-listas" element={<MyListsPage />} />
        </Routes>
    )
}

export default App