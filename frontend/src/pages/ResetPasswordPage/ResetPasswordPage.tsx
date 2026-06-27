import { useState } from 'react';
import type { FormEventHandler } from 'react';
import { Link, useNavigate } from 'react-router'
import { supabase } from '../../lib/supabaseClient'
import styles from './ResetPasswordPage.module.scss'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import AuthInput from '../../components/AuthInput/AuthInput'

function ResetPasswordPage() {

    //Redirige el login en caso de éxito.
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')

    const handleResetPassword: FormEventHandler<HTMLFormElement> = async (event) => {
        //Evita la recarga del browser al enviar el form.
        event.preventDefault()

        //Limpia mensajes anteriores.
        setErrorMessage('')

        //Datos del form.
        const form = event.currentTarget
        const formData = new FormData(form)

        //Validación de campos obligatorios.
        const password = String(formData.get('password') ?? '')
        const confirmPassword = String(formData.get('confirmPassword') ?? '')

        if (!password || !confirmPassword) {
            setErrorMessage('Ambos campos son obligatorios.')
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.')
            return
        }

        //Actualiza la constraseña en Supabase.
        const { error } = await supabase.auth.updateUser({
            password,
        })

        if (error) {
            setErrorMessage('No se ha podido guardar la contraseña nueva.')
            return
        }

        //Redirección al login.
        navigate('/')
    }


    return (
        <main className={styles.resetPasswordPage}>
            {/*Sección izquierda. Presentación.*/}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1>TomoList</h1>
                    <p>Elige una contraseña nueva para recuperar el acceso a tu cuenta.</p>
                </div>
            </section>

            {/*Sección derecha. Form de nueva contraseña y la confirmación de la nueva contraseña.*/}
            <section className={styles.recoveryPanel}>
                <div className={styles.recoveryCard}>
                    <h2>Nueva contraseña</h2>
                    <p>Introduce y confirma tu contraseña nueva.</p>

                    <form className={styles.recoveryForm} onSubmit={handleResetPassword}>
                        <AuthInput
                            id="password"
                            label="Contraseña nueva"
                            //Oculta lo que se escribe en el input.
                            type="password"
                            placeholder="********"
                        />

                        <AuthInput
                            id="confirmPassword"
                            label="Repite la contraseña"
                            type="password"
                            placeholder="********"
                        />

                        <PrimaryButton type="submit">Guardar contraseña nueva</PrimaryButton>
                        {errorMessage && <p>{errorMessage}</p>}
                    </form>

                    {/*Redirige al login.*/}
                    <p className={styles.loginLinkText}>
                        ¿Ya la recuerdas? <Link to="/">Inicia sesión</Link>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default ResetPasswordPage