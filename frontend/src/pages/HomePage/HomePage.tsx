// Importa los estilos como CSSModule, evita que las clases sean globales y afecten a otras partes de la app.
import styles from './HomePage.module.scss'
// Importa iconos.
import {
    LibraryBig,
    ListCheck,
    Star,
    MessageSquareText,
} from 'lucide-react'
// Enrutamiento
import { Link } from 'react-router'
// Componentes
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import AuthInput from '../../components/AuthInput/AuthInput'


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
                <form className={styles.authForm}>
                    <AuthInput
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="tu@email.com"
                        />
                    <AuthInput
                        id="password"
                        label="Constraseña"
                        type="password"
                        placeholder="*******"
                    />

                    <Link className={styles.forgotPasswordLink} to="/forgot-password">
                        ¿Has olvidado tu constraseña?
                    </Link>

                    <PrimaryButton>Iniciar sesión</PrimaryButton>
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