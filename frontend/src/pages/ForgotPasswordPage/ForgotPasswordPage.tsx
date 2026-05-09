import { Link } from "react-router";
import styles from './ForgotPasswordPage.module.scss'

function ForgotPasswordPage() {
    return (
        <main className={styles.forgotPasswordPage}>
            {/*Sección izquierda. Flujo de recuperación.*/}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1>Recupera tu acceso</h1>
                    <p>Introduce tu email para recuperar tu cuenta y crear una nueva contraseña.</p>
                </div>
            </section>

            {/*Sección derecha. Form de recuperación de contraseña.*/}
            <section className={styles.recoveryPanel}>
                <div className={styles.recoveryCard}>
                    <h2>¿Olvidaste la contraseña?</h2>
                    <p>Escribe el email asociado a tu cuenta para iniciar la recuperación.</p>

                    {/*Form.*/}
                    <form className={styles.recoveryForm}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                        />
                        <button type="button">Recuperar cuenta</button>
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