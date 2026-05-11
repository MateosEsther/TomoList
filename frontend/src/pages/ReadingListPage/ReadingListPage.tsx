//Página reutilizable para mostrar una lista concreta de lecturas.
//La lista se decide a partir de la URL: /listas/:type/:status.

//Para crear una ruta dinámica en función del tipo de lectura y el estatus.
import { useParams } from 'react-router';
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar';
import styles from './ReadingListPage.module.scss'


function ReadingListPage() {
    //Prepara el parámetro useParams que va a leer las partes dinámicas de la URL.
    //Extrae los valores type y status desde /listas/:type/:status de la URL.
    const { type, status } = useParams()

    //Convierte el tipo de lectura de la URL en texto visible para el usuario.
    const readingTypeLabel = type === 'manga' ? 'Manga' : 'Literatura'
    //Convierte el estado de lectura de la URL en texto visible para el usuario.
    const readingStatusLabel = status === 'pendientes' ? 'pendientes' : 'leídas'

    //Título principal construido dinámicamente a partir de la URL.
    const pageTitle = `${readingTypeLabel} ${readingStatusLabel}`

    return (
        <div className={styles.readingListPage}>
            <PrivateSidebar />

            {/*Contenido de la lista seleccionada.*/}
            <main className={styles.content}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1>{pageTitle}</h1>

                        <p>
                            Lecturas guardadas dentro de la lista seleccionada
                        </p>
                    </div>
                </header>

                {/*Cards de lecturas.*/}
                <section className={styles.emptyState}>
                    <h2>sin lecturas de momento</h2>

                    <p>
                        Aquí aparecerán las lecturas cuando las añade el usuario.
                    </p>
                </section>
            </main>
        </div>
    )
}

export default ReadingListPage
