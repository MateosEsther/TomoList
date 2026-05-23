//useState para guardar mensajes de error/success
import { useState } from 'react'
//FormEvent tipa el evento del form
import type { FormEventHandler } from 'react'
import { Link } from 'react-router'

import AuthInput from '../../components/AuthInput/AuthInput'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { supabase } from '../../lib/supabaseClient'
import styles from './RegisterPage.module.scss'


function RegisterPage() {
    
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleRegister: FormEventHandler<HTMLFormElement> = async (event) => {
        //Evita que el navegador recargue la página al enviar el form.
        event.preventDefault()

        //Guarda una referencia al form para limpiarlo después.
        const form = event.currentTarget

        //Limpia mensajes anteriores previa validación o envío de datos.
        setErrorMessage('')
        setSuccessMessage('')

        const formData = new FormData(form)

        const name = String(formData.get('name') ?? '').trim()
        const surname = String(formData.get('surname') ?? '').trim()
        const email = String(formData.get('email') ?? '').trim()
        const password = String(formData.get('password') ?? '').trim()
        const confirmPassword = String(formData.get('confirmPassword') ?? '').trim()

        if (!name || !surname || !email || !password || !confirmPassword) {
            setErrorMessage('Todos los campos son obligatorios.')
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.')
            return
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    surname,
                },
            },
        })

        //En caso de error en el registro.
        if (error) {
            setErrorMessage(error.message)
            return
        }
        
        //Resetea valores del form con la cuenta creada correctamente.
        form.reset()
        setSuccessMessage('Cuenta creada correctamente.')
    }


    return (
        <main className={styles.registerPage}>
            {/*Sección izquierda. Presentación.*/}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1>TomoList</h1>
                    <p>
                        Empieza a organizar tus lecturas, sean del género que sean, como nunca antes.
                        Crea listas, añade lecturas pendientes o lecturas pasadas, y guarda tus impresiones para no perder detalles.
                    </p>
                </div>
            </section>

            {/*Sección derecha. Form de registro.*/}
            <section className={styles.registerPanel}>
                <div className={styles.registerCard}>
                    <h2>Regístrate</h2>
                    <p>
                        Crea tu cuenta para empezar a gestionar tus listas.
                    </p>

                    {/*Formulario de registro*/}
                    <form className={styles.registerForm} onSubmit={handleRegister}>
                        <AuthInput
                            id="name"
                            label="Nombre"
                            type="text"
                            placeholder="Tu nombre"
                            size="compact" //porque tiene más campos y así se ve sin scrollear
                        />

                        <AuthInput
                            id="surname"
                            label="Apellidos"
                            type="text"
                            placeholder="Tus apellidos"
                            size="compact"
                        />

                        <AuthInput
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="tu@email.com"
                            size="compact"
                        />

                        <AuthInput
                            id="password"
                            label="Contraseña"
                            type="password"
                            placeholder="********"
                            size="compact"
                        />

                        <AuthInput
                            id="confirmPassword"
                            label="Repite la contraseña"
                            type="password"
                            placeholder="********"
                            size="compact"
                        />

                        <PrimaryButton type="submit">Crear cuenta</PrimaryButton>
                        {errorMessage && <p>{errorMessage}</p>}
                        {successMessage && <p>{successMessage}</p>}
                    </form>
                    <p className={styles.loginLinkText}>
                        ¿Ya tienes cuenta? <Link to='/'>Inicia sesión</Link>
                    </p>
                </div>
            </section>

        </main>

    )
}

export default RegisterPage