//Página reutilizable para mostrar una lista concreta de lecturas.
//La lista se decide a partir de la URL: /listas/:type/:status.

//Guarda el modo vista activo.
import { useState } from 'react';
//Para crear una ruta dinámica en función del tipo de lectura y el estatus.
import { useParams } from 'react-router';
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar';
import styles from './ReadingListPage.module.scss'

//Valores posibles del modo vista. En grid con toda la información de las lecturas o en list con información reducida.
type ViewMode = 'grid' | 'list'

//Define la forma que tendrá cada lectura.
type Reading = {
    id: number
    title: string
    author: string
    type: 'manga' | 'literature'
    status: 'pending' | 'read'
    coverUrl?: string
    synopsis: string
    readMonth?: string
    rating?: number
    review?: string
}

//Datos de diseño temporales.
const sampleReadings: Reading[] = [
    {
        id: 1,
        title: 'Berserk',
        author: 'Kentaro Miura',
        type: 'manga',
        status: 'pending',
        synopsis: 'Un manga de fantasía oscura que se añadirá a la lista de lecturas pendientes.'
    },
    {
        id: 2,
        title: 'Monster',
        author: 'Naoki Urasawa',
        type: 'manga',
        status: 'read',
        synopsis: 'Un thriller psicológico con una narrativa compleja y personajes muy desarrollados.',
        readMonth: '2025-04',
        rating: 5,
        review: 'Una lectura intensa, adulta y muy bien construida.',
    },
    {
        id: 3,
        title: 'Pedro Páramo',
        author: 'Juan Rulfo',
        type: 'literature',
        status: 'read',
        synopsis: 'Una obra breve e intensa donde memoria, muerte y voces fragmentadas se mezclan.',
        readMonth: '2025-03',
        rating: 4,
        review: 'Muy atmosférico y con una estructura narrativa muy potente.',
    },
    {
        id: 4,
        title: 'Cien años de soledad',
        author: 'Gabriel García Márquez',
        type: 'literature',
        status: 'pending',
        synopsis: 'Una lectura pendiente de literatura latinoamericana que aparecerá con portada y sinopsis.',
    },
]

function ReadingListPage() {
    //Prepara el parámetro useParams que va a leer las partes dinámicas de la URL.
    //Extrae los valores type y status desde /listas/:type/:status de la URL.
    const { type, status } = useParams()

    //Guarda el modo vista seleccionado.
    const [viewMode, setViewMode] = useState<ViewMode>('grid')

    //Convierte el tipo recibido por URL al valor interno usado por las lecturas.
    const readingType = type === 'manga' ? 'manga' : 'literature'
    //Convierte el estado recibido por la URL al valor interno usado por las lecturas.
    const readingStatus = status === 'pendientes' ? 'pending' : 'read'

    //Convierte el tipo de lectura de la URL en texto visible para el usuario.
    const readingTypeLabel = type === 'manga' ? 'Manga' : 'Literatura'
    //Convierte el estado de lectura de la URL en texto visible para el usuario.
    const readingStatusLabel = status === 'pendientes' ? 'pendientes' : 'leídas'

    //Título principal construido dinámicamente a partir de la URL.
    const pageTitle = `${readingTypeLabel} ${readingStatusLabel}`

    //Filtra los datos temporales según la ruta actual.
    const filteredReadings = sampleReadings.filter((reading) => {
        return reading.type === readingType && reading.status === readingStatus
    })

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

                {/*Selector del modo vista.*/}
                <section className={styles.viewToolbar}>
                    <p>Modo vista</p>

                    <div>
                        <button
                            type="button"
                            className={
                                viewMode === 'grid'
                                    ? `${styles.viewButton} ${styles.activeView}`
                                    : styles.viewButton 
                            }
                            onClick={() => setViewMode('grid')}
                        >
                            Tarjetas
                        </button>

                        <button
                            type="button"
                            className={
                                viewMode === 'list'
                                    ? `${styles.viewButton} ${styles.activeView}`
                                    : styles.viewButton
                            }
                            onClick={() => setViewMode('list')}
                        >
                            Lista
                        </button>
                    </div>
                </section>

                {/*Meto lecturas temporales para ver como quedan. Luego vendrán del back y la API. */}
                <section
                    className={
                        viewMode === 'grid'
                        ? styles.readingGrid
                        : styles.readingList
                    }
                >
                    {filteredReadings.map((reading) => (
                        <article className={styles.readingCard} key={reading.id}>
                            {/*Portada solo en la vista tarjeta.*/}
                            {viewMode === 'grid' && (
                                <div className={styles.coverBox}>
                                    {reading.coverUrl ? (
                                        <img
                                            src={reading.coverUrl}
                                            alt={`Portada de ${reading.title}`}
                                        />
                                    ) : (
                                            <span>Sin portada</span>
                                    )}
                                </div>
                            )}

                            <div className={styles.readingInfo}>
                                <h2>{reading.title}</h2>

                                <p className={styles.author}>
                                    {reading.author}
                                </p>

                                {/*Solo se muestra la información completa en la vista tarjeta.
                                <>...</> fragement (agrupa elementos en JSX sin crear div extra en el HTML.*/}
                                {viewMode === 'grid' && (
                                    <>
                                        <p className={styles.synopsis}>
                                            {reading.synopsis}
                                        </p>
                                    
                                        <div className={styles.metaInfo}>
                                            <span>
                                                {reading.type === 'manga' ? 'Manga' : 'Literatura'}
                                            </span>

                                            <span>
                                                {reading.status === 'pending' ? 'Pendiente' : 'Leída'}
                                            </span>

                                            {reading.readMonth && (
                                                <span>
                                                    Leído en {reading.readMonth}
                                                </span>
                                            )}

                                            {reading.rating && (
                                                <span>
                                                    {reading.rating}/5
                                                </span>
                                            )}
                                        </div>
                                        {reading.review && (
                                            <p className={styles.review}>
                                                {reading.review}
                                            </p>
                                        )}
                                    </>
                                )}

                                {/*En vista lista, solo la fecha (si existe).*/}
                                {viewMode === 'list' && reading.readMonth && (
                                    <p className={styles.listDate}>
                                        Leído en {reading.readMonth}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    )
}

export default ReadingListPage
