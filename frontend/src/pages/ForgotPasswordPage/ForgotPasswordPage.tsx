import { useState } from 'react';
import type { FormEventHandler } from 'react';
import { Link } from 'react-router';
import { supabase } from '../../lib/supabaseClient';
import styles from './ForgotPasswordPage.module.scss'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import AuthInput from '../../components/AuthInput/AuthInput';

function ForgotPasswordPage() {

    // Mensajes errores y éxito.
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleForgotPassword: FormEventHandler<HTMLFormElement> = async (event) => {
        //Evita la recarga del browser al enviar el form.
        event.preventDefault()

        //Limpia mensajes anteriores.
        setErrorMessage('')
        setSuccessMessage('')
        
        //Datos del form.
        const form = event.currentTarget
        const formData = new FormData(form)
        const email = String(formData.get('email') ?? '').trim()

        //Email obligatorio.
        if(!email) {
            setErrorMessage('El email es obligatorio.')
            return
        }

        //Pide a Supabase que envíe el email de recuperación.
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            //Redirección a la vista de recuperación de contraseña. 
            //window.location.origin es la URL base de la app, se lo dice a Supabase 
            //para que redirija a la vista de recuperación de contraseña.
            redirectTo: `${window.location.origin}/reset-password`,
        })

        //Mensajes de error/éxito sin revelar la existencia de la cuenta.
        if(error) {
            setErrorMessage('No se ha podido enviar el email de recuperación.')
            return
        }

        form.reset()
        setSuccessMessage(
            'Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.'
        )
    } 


    return (
        <main className={styles.forgotPasswordPage}>
            {/*Sección izquierda. Flujo de recuperación.*/}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1>TomoList</h1>
                    <p>Recupera el acceso a tu cuenta y vuelve a organizar tus lecturas.</p>
                </div>
            </section>

            {/*Sección derecha. Form de recuperación de contraseña.*/}
            <section className={styles.recoveryPanel}>
                <div className={styles.recoveryCard}>
                    <h2>¿Olvidaste la contraseña?</h2>
                    <p>Escribe el email asociado a tu cuenta para iniciar la recuperación.</p>

                    <form className={styles.recoveryForm} onSubmit={handleForgotPassword}>
                        <AuthInput
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="tu@email.com"
                        />
                        <PrimaryButton type="submit">Recuperar cuenta</PrimaryButton>
                        {errorMessage && <p>{errorMessage}</p>}
                        {successMessage && <p>{successMessage}</p>}

                    </form>

                    <p className={styles.loginLinkText}>
                        ¿Ya la recuerdas? <Link to="/">Inicia sesión</Link>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default ForgotPasswordPage