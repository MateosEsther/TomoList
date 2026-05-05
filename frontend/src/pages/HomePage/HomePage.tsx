// Importa los estilos como CSSModule, evita que las clases sean globales y afecten a otras partes de la app.
import styles from './HomePage.module.scss'

// Pantalla inicial de TomoList.
function HomePage() {
    return (
        <main className={styles.homePage}>
        {/* Sección izquierda/informativa.*/}
        <section className={styles.heroSection}>
            <h1>TomoList</h1>

            <p>
            Organiza tus lecturas de manga y literatura en un solo lugar.
            </p>
        </section>

        {/*Sección derecha/acceso.*/}
        <section className={styles.authSection}>
            <h2>Accede a tu cuenta</h2>

            <p>
            Inicia sesión para consultar y actualizar tus listas.
            </p>
        </section>
        </main>
    )
}

export default HomePage