import { useEffect, useState } from 'react';
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { supabase } from '../../lib/supabaseClient';
import styles from './ProfilePage.module.scss'
import { AVATAR_IDS, getAvatarUrl } from '../../utils/avatar';
import { useProfile } from '../../hooks/useProfile';
import type { Profile } from '../../context/ProfileContext';
import AuthInput from '../../components/AuthInput/AuthInput';
import type { FormEventHandler } from 'react';

//Datos que recibe el form desde ProfilePage.
type ProfileFormProps = {
    profile: Profile
    userId: string
    email: string
    refreshProfile: () => Promise<void>
}

function ProfilePage() {
    //Recoge los datos compartidos por ProfileProvider.
    const {
        profile,
        userId,
        email,
        isLoadingProfile,
        refreshProfile,
    } = useProfile()

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

                {/*Mientras no exista perfil cargado, muestra un estado provisonal. */}
                {isLoadingProfile && !profile && (
                    <p>Cargando perfil...</p>
                )}

                {/*Si termina la carga sin obtener perfil o usuario, muestra error.*/}
                {!isLoadingProfile && (!profile || !userId) && (
                    <p>No se ha podido cargar el perfil.</p>
                )}

                {/*Si existen los datos necesarios, muestra el form editable.*/}
                {profile && userId && (
                    <ProfileForm
                        profile={profile}
                        userId={userId}
                        email={email}
                        refreshProfile={refreshProfile}
                    />
                )}

                {/*Sección de seguridad.*/}
                <section className={styles.securityCard}>
                    <ChangePasswordForm />
                </section>
            </main>
        </div>
    )
}

export default ProfilePage


//Form editable del perfil.
function ProfileForm ({
    profile,
    userId,
    email,
    refreshProfile
}: ProfileFormProps) {
    //Guarda el avatar seleccionado.
    const [selectedAvatarId, setSelectedAvatarId] = useState(
        profile.avatar_id || 'avatar-01'
    )

    //Guardan los datos editables.
    const [display_name, setDisplayName] = useState(
        profile.display_name ?? ''
    )
    const [name, setName] = useState(
        profile.name ?? ''
    )
    const [surname, setSurname] = useState(
        profile.surname ?? ''
    )

    //Guarda mensajes del form.
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        //Si no hay mensaje de éxito, no se crea temporizador.
        if (!successMessage) {
            return
        }

        //Programa la desaparición del mensaje.
        const timeout = setTimeout(() => {
            setSuccessMessage('')
        }, 3000)

        //Si el componente se desmonta o cambia el mensaje antes de tiempo, elimina el temporizador.
        return () => {
            clearTimeout(timeout)
        }
    }, [successMessage])

    //Nombre visible guardado en Supabase.
    const profileDisplayName = profile.display_name || 'Usuario'
    //Avatar.
    const avatarUrl = getAvatarUrl(selectedAvatarId)

    //Guarda los cambios del perfil en Supabase.
    async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
        //Evita que el form recargue la página.
        event.preventDefault()

        //Limpia mensajes anteriores.
        setErrorMessage('')
        setSuccessMessage('')

        //Elimna espacios innecesarios.
        const cleanDisplayName = display_name.trim()
        const cleanName = name.trim()
        const cleanSurname = surname.trim()

        //Validación básica.
        if (!cleanDisplayName || !cleanName || !cleanSurname ) {
            setErrorMessage('Nick, nombre y apellidos son obligatorios.')
            return
        }

        //Actualiza solo la fila del user autenticado.
        const { error } = await supabase
            .from('profiles')
            .update({
                display_name: cleanDisplayName,
                name: cleanName,
                surname: cleanSurname,
                avatar_id: selectedAvatarId,
            })
            .eq('id', userId)

        //Si Supabse devuelve error, mensaje:
        if (error) {
            setErrorMessage('No se han podido guardar los cambios.')
            return
        }

        //Conserva en los inputs los valores ya saneados.
        setDisplayName(cleanDisplayName)
        setName(cleanName)
        setSurname(cleanSurname)

        //Refresca el contexto global. Así Mi perfil y sidebar reciben los datos a la vez.
        await refreshProfile()

        //Confirma que el guardado ha terminado.
        setSuccessMessage('Perfil actualizado correctamente.')
    }

    return (
        <section className={styles.profileCard}>
            <div className={styles.profileIntro}>
                <div className={styles.currentAvatar} aria-hidden="true">
                    <img src={avatarUrl} alt="" />
                </div>

                <div>
                    <h2>{profileDisplayName}</h2>
                    <p>{email}</p>
                </div>
            </div>

            {/*Selector de avatares predefinidos.*/}
            <section className={styles.avatarSection}>
                <h3>ELige tu avatar</h3>
                <p>
                    Selecciona uno de los avatares disponibles.
                </p>

                <div className={styles.avatarGrid}>
                    {AVATAR_IDS.map((avatarId) => (
                        <label className={styles.avatarOption} key={avatarId}>
                            <input
                                type="radio"
                                name="avatar"
                                value={avatarId}
                                checked={selectedAvatarId === avatarId}
                                onChange={() => setSelectedAvatarId(avatarId)}
                            />
                            <img
                                src={getAvatarUrl(avatarId)}
                                alt=""
                                aria-hidden="true"
                            />
                        </label>
                    ))}
                </div>
            </section>

            {/*Form de datos editables.*/}
            <form className={styles.profileForm} onSubmit={handleSaveProfile}>
                <div className={styles.field}>
                    <label htmlFor="displayName">Nick</label>
                    <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        value={display_name}
                        onChange={(event) => setDisplayName(event.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="surname">Apellidos</label>
                    <input
                        id="surname"
                        name="surname"
                        type="text"
                        value={surname}
                        onChange={(event) => setSurname(event.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={email}
                        disabled
                    />
                </div>

                <PrimaryButton type="submit">Guardar cambios</PrimaryButton>

                {/*Mensaje error al guardar.*/}
                {errorMessage && (
                    <p className={styles.errorMessage}>
                        {errorMessage}
                    </p>
                )}
                {/*Mensaje de éxito al guardar.*/}
                {successMessage && (
                    <p className={styles.successMessage}>
                        {successMessage}
                    </p>
                )}
            </form>
        </section>
    )
}

function ChangePasswordForm() {

    //Muestra o no el formularo de cambio de contraseña.
    const [isFormVisible, setIsFormVisible] = useState(false)
    //Validaciones de Supabase.
    const [errorMessage, setErrorMessage] = useState('')
    //Confirmación de éxito al guardarse.
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if(!successMessage) {
            return
        }

        //Timeout para eliminar el mensaje de éxito después de 3 segundos.
        const timeout = setTimeout(() => {
            setSuccessMessage('')
        }, 3000)

        return () => {
            clearTimeout(timeout)
        }
    }, [successMessage])

    const handleChangePassword: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()

        setErrorMessage('')
        setSuccessMessage('')

        //Referencia al form.
        const form = event.currentTarget
        //Guarda los datos del form.
        const formData = new FormData(form)

        //Guarda los valores de los inputs nuevos.
        const password = String(formData.get('password') ?? '')
        const confirmPassword = String(formData.get('confirmPassword') ?? '')

        //Valida campos obligatorios.
        if (!password || !confirmPassword) {
            setErrorMessage('Ambos campos son obligatorios.')
            return
        }

        //Valida que las contraseñas coincidan.
        if (password !== confirmPassword) {
            setErrorMessage('Las contraseñas deben coincidir.')
            return
        }

        //Actualiza password en Supabase Auth.
        const { error } = await supabase.auth.updateUser({
            password,
        })

        //Error en Supabase Auth..
        if (error) {
            setErrorMessage('No se ha podido cambiar la contraseña.')
            return
        }

        //Reset del form, cierra form y muestra mensaje de éxito.
        form.reset()
        setIsFormVisible(false)
        setSuccessMessage('Contraseña actualizada correctamente.')
    }

    return (
        <>
            <h2>Seguridad</h2>
            <p> 
                Cambio de contraseña.
            </p>

            {!isFormVisible && (
                <button
                 type="button"
                 className={styles.secondaryButton}
                 onClick={() => setIsFormVisible(true)}
                >
                    Cambiar contraseña
                </button>
            )}

            {isFormVisible && (
                <form className={styles.passwordForm} onSubmit={handleChangePassword}>
                    <AuthInput 
                        id="password"
                        label="Contraseña nueva"
                        type="password"
                        placeholder="*******"
                    />

                    <AuthInput
                        id="confirmPassword"
                        label="Repite la contraseña"
                        type="password"
                        placeholder="*******"
                    />

                    <div className={styles.passwordFormActions}>
                        <PrimaryButton type="submit">
                            Guardar contraseña nueva
                        </PrimaryButton>

                        <button
                         type="button"
                         className={styles.secondaryButton}
                         onClick={() => {
                            setIsFormVisible(false)
                            setErrorMessage('')
                        }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        
            {/*Mensaje de error/éxito al cambiar la contraseña.*/}
            {errorMessage && (
                <p className={styles.errorMessage}>
                    {errorMessage}
                </p>
            )}
            {successMessage && (
                <p className={styles.successMessage}>
                    {successMessage}
                </p>
            )}
        </>
    )

    {/*Mensaje de error/éxito al cambiar la contraseña.*/}
    {errorMessage && (
        <p className={styles.errorMessage}>
            {errorMessage}
        </p>
    )}
    {successMessage && (
        <p className={styles.successMessage}>
            {successMessage}
        </p>
    )}
}