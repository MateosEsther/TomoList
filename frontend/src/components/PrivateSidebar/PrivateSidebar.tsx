import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
    BookOpen,
    Plus,
    LogOut,
} from 'lucide-react'
import styles from './PrivateSidebar.module.scss'
import { supabase } from '../../lib/supabaseClient'
import { getAvatarUrl } from '../../utils/avatar'

//Datos de sidebar.
type SidebarProfile = {
    display_name: string
    avatar_id: string
}

function PrivateSidebar() {
    //Redirección
    const navigate = useNavigate()
    //Guarda los datos mínimos para el perfil de usuario.
    const [profile, setProfile] = useState<SidebarProfile | null>(null)

    //Carga el perfil autenticado al mostrar el sidebar.
    useEffect(() => {
        let isMounted = true

        async function loadSidebarProfile() {
            //Obteniene el usuario autenticado desde Supabase Auth.
            const { data: userData, error: userError } = await supabase.auth.getUser()

            //Si el componente no está en pantalla, no actualiza.
            if (!isMounted) {
                return
            }
            
            //Si no hay usuario, no carga perfil. 
            if (userError || !userData.user) {
                return
            }

            //Busca el perfil asociado al usuario autenticado.
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('display_name, avatar_id')
                .eq('id', userData.user.id)
                .single()

            //Si el componente ya no está en pantalla, no actualiza estado.
            if (!isMounted) {
                return
            }

            //Si falla la consulta, no rompe el sidebar.
            if (profileError) {
                return
            }

            //Guarda el perfil real.
            setProfile(profileData)
        }

        loadSidebarProfile()

        //Limpia al desmontar el componente.
        return () => {
            isMounted = false
        }
    }, [])

    //Nombre visible del user en el sidebar.
    const userName = profile?.display_name || 'Usuari@'

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