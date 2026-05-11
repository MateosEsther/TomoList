import { Link } from 'react-router'
import {
    BookOpen,
    Plus,
    LogOut,
} from 'lucide-react'
import styles from './PrivateSidebar.module.scss'

function PrivateSidebar() {
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
                    E
                </div>

                <div>
                    <p className={styles.userName}>Esther</p>
                    <p className={styles.userEmail}>usuario@tomolist.com</p>
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
            <button className={styles.logoutButton} type="button">
                <LogOut aria-hidden="true" />
                Cerrar sesión
            </button>

        </aside>
    )
}

export default PrivateSidebar