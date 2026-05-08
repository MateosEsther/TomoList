// Importa los estilos como CSSModule, evita que las clases sean globales y afecten a otras partes de la app.
import styles from './HomePage.module.scss'
import {
    LibraryBig,
    ListCheck,
    Star,
    MessageSquareText,
} from 'lucide-react'

// Pantalla inicial de TomoList.
function HomePage() {
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
                        <span className={styles.featureIcon} aria-hidden="true">
                            <LibraryBig />
                        </span>
                        <h2>Crea tu propia biblioteca</h2>
                        <p>Organiza tus lecturas en listas y guárdalas para acceder a ellas en cualquier momento.</p>
                    </article>

                    <article className={styles.featureCard}>
                        <span className={styles.featureIcon} aria-hidden="true">
                            <ListCheck />
                        </span>
                        <h2>Haz listas de lecturas pendientes</h2>
                        <p>Así tendrás organizadas las próximas lecturas para cuando llegue el momento de elegir la siguiente aventura.</p>
                    </article>

                    <article className={styles.featureCard}>
                        <span className={styles.featureIcon} aria-hidden="true">
                            <Star />
                        </span>
                        <h2>Valóralas</h2>
                        <p>Puntúa las lecturas según tus opiniones.</p>
                    </article>

                    <article className={styles.featureCard}>
                        <span className={styles.featureIcon} aria-hidden="true">
                            <MessageSquareText />
                        </span>
                        <h2>Coméntalas</h2>
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
                <form className={styles.authForm}>
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
                        placeholder="*******"
                    />

                    <button type="button">Iniciar sesión</button>
                </form>

                <p className={styles.authLinkText}>
                    ¿No tienes cuenta? <span>Crear cuenta</span>
                </p>
            </div>
        </section>
        </main>
    )
}

export default HomePage