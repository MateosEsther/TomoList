import { Link, useNavigate } from 'react-router'
import {
    BookOpen,
    Plus,
    LogOut,
} from 'lucide-react'
import styles from './PrivateSidebar.module.scss'
import { supabase } from '../../lib/supabaseClient'
import { getAvatarUrl } from '../../utils/avatar'
import { useProfile  } from '../../hooks/useProfile'


function PrivateSidebar() {
    //Redirección
    const navigate = useNavigate()

    //Trae el perfil de user del Hook.
    const { profile } = useProfile()

    //Nombre visible del user en el sidebar.
    const userName = profile?.display_name || 'Usuario'

    //Avatar.
    const avatarUrl = profile?.avatar_id
        ? getAvatarUrl(profile?.avatar_id)
        : getAvatarUrl('avatar-01')

    //Cierra la sesión en supabase.
    async function handleLogout() {
        //Supabase elimna la sesión activa del navegador.
        const { error } = await supabase.auth.signOut()

        //Con error.
        if (error) {
            console.error('Error al cerrar sesión:', error.message)
            return
        }

        //Tras cerrar sesión, redirige a vista pública login.
        navigate('/')
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <BookOpen aria-hidden="true" />
                <strong>TomoList</strong>
            </div>

            {/*Bloque del usuario.*/}
            <Link 
                className={styles.userBox}
                to="/perfil"
                aria-label="Ir a mi perfil"
            >
                <div className={styles.userAvatar} aria-hidden="true">
                    <img src={avatarUrl} alt="" />
                </div>

                <div>
                    <p className={styles.userName}>{userName}</p>
                </div>
            </Link>

            {/*Navegación interna.*/}
            <nav className={styles.sidebarNav} aria-label="Navegación principal">
                <Link to="/mis-listas">Mis listas</Link>
                <Link to="/mis-listas">Pendientes</Link>
                <Link to="/mis-listas">Leídas</Link>
                <Link to="/perfil">Mi perfil</Link>
            </nav>

            {/*Acción principal.*/}
            <Link className={styles.addTomeLink} to="/anadir-tomo">
                <Plus aria-hidden="true" />
                Añadir tomo
            </Link>

            {/*Cierre de sesión.*/}
            <button 
                className={styles.logoutButton} 
                type="button"
                onClick={handleLogout}
            >
                <LogOut aria-hidden="true" />
                Cerrar sesión
            </button>

        </aside>
    )
}

export default PrivateSidebar