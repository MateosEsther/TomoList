import styles from './RegisterPage.module.scss'

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
                        <label htmlFor="name">Nombre</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Tu nombre"
                        />

                        <label htmlFor="surname">Apellidos</label>
                        <input
                            id="surname"
                            type="text"
                            placeholder="Tus apellidos"
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                        />

                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="********"
                        />

                        <label htmlFor="confirmPassword">Repite la contraseña</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="********"
                        />

                        <button type="button">Crear cuenta</button>
                    </form>
                    <p className={styles.loginLinkText}>
                        ¿Ya tienes cuenta? <span>Inicia sesión</span>
                    </p>
                </div>
            </section>

        </main>

    )
}

export default RegisterPage