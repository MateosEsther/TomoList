import { useEffect, useState } from 'react';
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { supabase } from '../../lib/supabaseClient';
import styles from './ProfilePage.module.scss'

//Datos de perfil a leer desde supabase.
type Profile = {
    name: string
    surname: string
    display_name: string
    avatar_id: string
}

function ProfilePage() {
    //Guarda los datos reales recogidos de la tabla profile.
    const [profile, setProfile] = useState<Profile | null>(null)

    //Guarda el mail con user autenticado de supabase.
    const [email, setEmail] = useState('')
    
    //Guarda mensaje si hay algún problema.
    const [errorMessage, setErrorMessage] = useState('')

    //Carga datos del usuer y su perfil al abrir ProfilePage.
    useEffect(() => {
        let isMounted = true

        async function loadProfile() {
            //Limpia errores anteriores.
            setErrorMessage('')

            //Recoge user autenticado desde Supabase Auth.
            const { data: userData, error: userError } = await supabase.auth.getUser()

            //Si el componente no está en pantalla, no actualiza estado.
            if (!isMounted) {
                return
            }

            //Si no puede obtener el user, error.
            if (userError || !userData.user) {
                setErrorMessage('No se han podido cargar los datos del usuario.')
                return
            }

            //Guarda el email real del user.
            setEmail(userData.user.email ?? '')

            //Bysca en profiles los datos asociados al user autenticado.
            const { data: profileData, error: profileError} = await supabase
                .from('profiles')
                .select('name, surname, display_name, avatar_id')
                .eq('id', userData.user.id)
                .single()
            
            //Si el componente ya no está en pantalla, no actualiza estado.
            if (!isMounted) {
                return
            }

            //Si fall la consulta, muestra error.
            if (profileError) {
                setErrorMessage('No se ha podido cargar el perfil.')
                return
            }

            //Guarda el perfil real.
            setProfile(profileData)
        }

        loadProfile()

        //Limpia el efecto si el componente se desmonta.
        return () => {
            isMounted = false
        }
    }, [])

    //Nombre que se muestra en cabecera.
    const profileDisplayName = profile?.display_name || 'Cargando...'
    //Avatar.
    const avatarLetter = profile?.name 
        ? profile.display_name.charAt(0).toUpperCase()
        : 'U'

    return (
        <div className={styles.profilePage}>
            <PrivateSidebar />

            {/*Contenido principal.*/}
            <main className={styles.content}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1>Mi perfil</h1>

                        <p>
                            Gestiona tus datos personales y elige tu avatar dentro de TomoList.
                        </p>
                    </div>
                </header>

                {/*Mensaje de error si no se cargan los datos del perfil.*/}
                {errorMessage && <p>{errorMessage}</p>}

                {/*Tarjeta principal de perfil.*/}
                <section className={styles.profileCard}>
                    <div className={styles.profileIntro}>
                        <div className={styles.currentAvatar} aria-hidden="true">
                            {avatarLetter}
                        </div>

                        <div>
                            <h2>{profileDisplayName}</h2>
                            <p>{email}</p>
                        </div>
                    </div>

                    {/*Selector de avatares predefinidos.*/}
                    <section className={styles.avatarSection}>
                        <h3>Elige tu avatar</h3>

                        <p>
                            Aquí irán los avatares a elegir.
                        </p>

                        <div className={styles.avatarGrid}>
                            <label className={styles.avatarOption}>
                                <input
                                    type="radio"
                                    name="avatar"
                                    defaultChecked
                                />
                                <span aria-hidden="true">E</span>
                            </label>

                            <label className={styles.avatarOption}>
                                <input
                                    type="radio"
                                    name="avatar"
                                />
                                <span aria-hidden="true">A</span>
                            </label>

                            <label className={styles.avatarOption}>
                                <input
                                    type="radio"
                                    name="avatar"
                                />
                                <span aria-hidden="true">B</span>
                            </label>

                            <label className={styles.avatarOption}>
                                <input
                                    type="radio"
                                    name="avatar"
                                />
                                <span aria-hidden="true">C</span>
                            </label>
                        </div>
                    </section>

                    {/*Form de datos de usuario.*/}
                    <form className={styles.profileForm}>
                        <div className={styles.field}>
                            <label htmlFor="displayName">Nick</label>
                            <input
                                id="displayName"
                                type="text"
                                defaultValue={profile?.display_name ?? ''}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                defaultValue={profile?.name ?? ''}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="surname">Apellidos</label>
                            <input
                                id="surname"
                                type="text"
                                defaultValue={profile?.surname ?? ''}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                disabled
                            />
                        </div>

                        <PrimaryButton>Guardar cambios</PrimaryButton>
                    </form>
                </section>

                {/*Sección de seguridad.*/}
                <section className={styles.securityCard}>
                    <h2>Seguridad</h2>

                    <p>
                        Cambio de contraseña.
                    </p>

                    <button type="button" className={styles.secondaryButton}>
                        Cambiar contraseña
                    </button>
                </section>
            </main>
        </div>
    )
}

export default ProfilePage