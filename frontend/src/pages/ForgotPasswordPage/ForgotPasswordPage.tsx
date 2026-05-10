import { Link } from 'react-router';
import styles from './ForgotPasswordPage.module.scss'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import AuthInput from '../../components/AuthInput/AuthInput';

function ForgotPasswordPage() {
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

                    <form className={styles.recoveryForm}>
                        <AuthInput
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="tu@email.com"
                        />
                        <PrimaryButton>Recuperar cuenta</PrimaryButton>
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