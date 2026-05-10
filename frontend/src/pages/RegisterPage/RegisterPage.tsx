import styles from './RegisterPage.module.scss'
import { Link } from 'react-router'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import AuthInput from '../../components/AuthInput/AuthInput'

function RegisterPage() {
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
                    <form className={styles.registerForm}>
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
                            label="Constraseña"
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

                        <PrimaryButton>Crear cuenta</PrimaryButton>
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