import { useState } from 'react'
import { 
    Link,
    useLocation,
    useNavigate,
} from 'react-router'
import {
    BookOpen,
    Plus,
    LogOut,
    ChevronDown,
    ChevronRight,
} from 'lucide-react'
import styles from './PrivateSidebar.module.scss'
import { supabase } from '../../lib/supabaseClient'
import { getAvatarUrl } from '../../utils/avatar'
import { useProfile  } from '../../hooks/useProfile'

//Selecciones desplegables disponibles.
type SidebarSection = 'pending' | 'read'

//Estado acordeón. Guarda la ruta de la sección que se abrió o cerró manualmente.
type AccordionState = {
    pathname: string
    openSection: SidebarSection | null
}

//Decide la sección abierta en función de la URL actual.
function getSectionFromPathname(pathname: string): SidebarSection | null {
    if (pathname.endsWith('/pending')) {
        return 'pending'
    }

    if (pathname.endsWith('/read')) {
        return 'read'
    }

    return null
}

function PrivateSidebar() {
    //Redirección
    const navigate = useNavigate()

    //Ruta actual.
    const { pathname } = useLocation()

    //Guarda la sección abierta o cerrada.
    const [accordionState, setAccordionState] = useState<AccordionState>(() => ({
        pathname,
        openSection: getSectionFromPathname(pathname),
    }))

    //Si cambia la ruta: abre la sección correspondiente.
    const openSection =
        accordionState.pathname === pathname
            ? accordionState.openSection
            : getSectionFromPathname(pathname)

    //Abre o cierra una sección (porque solo hay 1 openSection).
    function toggleSection(section: SidebarSection) {
        setAccordionState({
            pathname,
            openSection: openSection === section
                ? null
                :section,
        })
    }

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

                {/*Bloque desplegable de lecturas pendientes.*/}
                <div className={styles.navGroup}>
                    <button
                        className={styles.navGroupButton}
                        type="button"
                        aria-expanded={openSection === 'pending'}
                        onClick={() => toggleSection('pending')}
                    >
                        <span>Pendientes</span>
                        {openSection === 'pending'
                            ? <ChevronDown aria-hidden="true" />
                            : <ChevronRight aria-hidden="true" />
                        }
                    </button>

                    {openSection === 'pending' && (
                        <div className={styles.submenu}>
                            <Link to="/listas/manga/pending">Manga</Link>
                            <Link to="/listas/literature/pending">Literatura</Link>
                        </div>
                    )}
                </div>

                {/*Bloque desplegable de lecturas terminadas.*/}
                <div className={styles.navGroup}>
                    <button
                        className={styles.navGroupButton}
                        type="button"
                        aria-expanded={openSection === 'read'}
                        onClick={() => toggleSection('read')}
                    >
                        <span>Leídas</span>
                        {openSection === 'read'
                            ? <ChevronDown aria-hidden="true" />
                            : <ChevronRight aria-hidden="true" />
                        }
                    </button>

                    {openSection === 'read' && (
                        <div className={styles.submenu}>
                            <Link to="/listas/manga/read">Manga</Link>
                            <Link to="/listas/literature/read">Literatura</Link>
                        </div>
                    )}
                </div>

                <Link to="/perfil">Mi perfil</Link>
            </nav>

            {/*Acción principal.*/}
            <Link className={styles.addTomeLink} to="/anadir-tomo">
                <Plus aria-hidden="true" />
                Añadir lectura
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