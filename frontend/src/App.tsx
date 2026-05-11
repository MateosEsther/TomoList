// Routes y Route definen qué componente se renderiza.
import { Routes, Route } from 'react-router'

// Páginas disponibles.
import HomePage from './pages/HomePage/HomePage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'
import MyListsPage from './pages/MyListsPage/MyListsPage'
import AddTomePage from './pages/AddTomePage/AddTomePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'

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

            {/*Ruta añadir tomo.*/}
            <Route path="/anadir-tomo" element={<AddTomePage />} />

            {/*Ruta perfil de usuario.*/}
            <Route path="/perfil" element={<ProfilePage />} />

        </Routes>
    )
}

export default App