//useState para mostrar mensajes de error en pantalla.
//FormEventHandler para tipar la función que gestiona el envío del form.
import { useState } from 'react'
import type { FormEventHandler } from 'react'

// Importa los estilos como CSSModule, evita que las clases sean globales y afecten a otras partes de la app.
import styles from './HomePage.module.scss'

// Importa iconos.
import {
    LibraryBig,
    ListCheck,
    Star,
    MessageSquareText,
} from 'lucide-react'

//Enrutamiento, enlaces internos sin recargar y useNavigate para redirigir al usuario después de iniciar sesión
import { Link, useNavigate } from 'react-router'

//Componentes.
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import AuthInput from '../../components/AuthInput/AuthInput'

//Cliente de supabase para usar autenticación.
import { supabase } from '../../lib/supabaseClient'

// Pantalla inicial de TomoList.
function HomePage() {

    //Redirige al usuario con el login.
    const navigate = useNavigate()

    //Guarda el mensaje de error si el inicio de sesión falla.
    const [errorMessage, setErrorMessage] = useState('')

    //Función que se activa al hacer el login correcto.
    const handleLogin: FormEventHandler<HTMLFormElement> = async (event) => {
        //Evita que el browser recargue la página al enviar el form.
        event.preventDefault()

        //Limpia errores anteriores previa validación o envío de datos.
        setErrorMessage('')

        //Recoge datos del form usando los atributos de los inputs.
        const formData = new FormData(event.currentTarget)

        //Convierte los datos recogidos a string y limpia espacios.
        const email = String(formData.get('email') ?? '').trim()
        const password = String(formData.get('password') ?? '')

        //Validación antes de llamar a Supabase
        if (!email || !password) {
            setErrorMessage('Email y contraseña obligatorios.')
            return
        }
        
        //Inicio de sesión con Supabase Auth con los datos del form
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        //Si Supabase devuelve error
        if (error) {
            setErrorMessage('Email o contraseña incorrectos.')
            return
        }

        //Si el login es exitoso, redirección a listas 
        navigate('/mis-listas')
    }

    // Estructura principal.
    return (
        <main className={styles.homePage}>
        {/* Sección izquierda/informativa.*/}
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <h1>TomoList</h1>

                <p className={styles.heroDescription}>
                    Organiza tus lecturas de manga y literatura en un solo lugar.
                </p>

                {/* Tarjetas informativas.*/}
                <div className={styles.featureGrid}>
                    <article className={styles.featureCard}>
                        <div className={styles.featureHeader}>
                            <span className={styles.featureIcon} aria-hidden="true">
                                <LibraryBig />
                            </span>
                            <h2>Crea tu propia biblioteca</h2>
                        </div>
                    <p>Organiza tus lecturas en listas y guárdalas para acceder a ellas en cualquier momento.</p>
                    </article>
                
                    <article className={styles.featureCard}>
                        <div className={styles.featureHeader}>
                            <span className={styles.featureIcon} aria-hidden="true">
                                <ListCheck />
                            </span>
                            <h2>Haz listas de lecturas pendientes</h2>
                        </div>
                    <p>Así tendrás organizadas las próximas lecturas para cuando llegue el momento de elegir la siguiente aventura.</p>
                    </article>

                    <article className={styles.featureCard}>
                        <div className={styles.featureHeader}>
                            <span className={styles.featureIcon} aria-hidden="true">
                                <Star />
                            </span>
                            <h2>Valóralas</h2>
                        </div>
                    <p>Puntúa las lecturas según tus opiniones.</p>
                    </article>

                    <article className={styles.featureCard}>
                        <div className={styles.featureHeader}>
                            <span className={styles.featureIcon} aria-hidden="true">
                                <MessageSquareText />
                            </span>
                            <h2>Coméntalas</h2>
                        </div>
                    <p>Escribe reseñas para recordar tus impresiones.</p>
                    </article>
                </div>

            </div>
        </section>

        {/*Sección derecha/acceso.*/}
        <section className={styles.authPanel}>
            <div className={styles.authCard}>
                <h2>Accede a tu cuenta</h2>
                <p>Inicia sesión para consultar y actualizar tus listas.</p>
        
                {/*Form*/}
                <form className={styles.authForm} onSubmit={handleLogin}>
                    <AuthInput
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="tu@email.com"
                        />
                    <AuthInput
                        id="password"
                        label="Contraseña"
                        type="password"
                        placeholder="*******"
                    />

                    <Link className={styles.forgotPasswordLink} to="/forgot-password">
                        ¿Has olvidado tu contraseña?
                    </Link>

                    <PrimaryButton type="submit">Iniciar sesión</PrimaryButton>
                    {/*Mensaje de eror de inicio de sesión.*/}
                    {errorMessage && <p>{errorMessage}</p>}

                </form>

                <p className={styles.authLinkText}>
                    ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
                </p>
            </div>
        </section>
        </main>
    )
}

export default HomePage