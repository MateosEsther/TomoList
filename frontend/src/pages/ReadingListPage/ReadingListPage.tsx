//Página reutilizable para mostrar una lista concreta de lecturas.
//La lista se decide a partir de la URL: /listas/:type/:status.

//Guarda el modo vista activo.
import { useEffect, useState } from 'react';
//Para crear una ruta dinámica en función del tipo de lectura y el estatus.
import { useParams } from 'react-router';
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar';
import styles from './ReadingListPage.module.scss'
import { supabase } from '../../lib/supabaseClient';
import { 
    formatAuthor,
    formatTittle,
} from '../../utils/text';


//Valores posibles del modo vista. En grid con toda la información de las lecturas o en list con información reducida.
type ViewMode = 'grid' | 'list'

//Define la forma que tendrá cada lectura traída de Supabase.
type Reading = {
    id: string
    title: string
    author: string
    type: 'manga' | 'literature'
    status: 'pending' | 'read'
    coverUrl?: string | null
    synopsis: string | null
    readMonth: string | null
    rating: number | null
    review: string | null
}

function ReadingListPage() {
    //Prepara el parámetro useParams que va a leer las partes dinámicas de la URL.
    //Extrae los valores type y status desde /listas/:type/:status de la URL.
    const { type, status } = useParams()

    //Guarda el modo vista seleccionado.
    const [viewMode, setViewMode] = useState<ViewMode>('grid')

    //Guarda lecturas traídas de Supabase.
    const [readings, setReadings] = useState<Reading[]>([])

    //Guarda el filtro de la consulta terminada. Informa si la lista sigue cargando.
    const [loadedFilter, setLoadedFilter] = useState('')

    //Guarda mensaje si falla la consulta.
    const [errorMessage, setErrorMessage] = useState('')

    //Convierte el tipo recibido por URL al valor interno usado por las lecturas.
    const readingType = type === 'manga' ? 'manga' : 'literature'
    //Convierte el estado recibido por la URL al valor interno usado por las lecturas.
    const readingStatus = status === 'pending' ? 'pending' : 'read'

    //Convierte el tipo de lectura de la URL en texto visible para el usuario.
    const readingTypeLabel = type === 'manga' ? 'Manga' : 'Literatura'
    //Convierte el estado de lectura de la URL en texto visible para el usuario.
    const readingStatusLabel = status === 'pending' ? 'pendientes' : 'leídas'

    //Título principal construido dinámicamente a partir de la URL.
    const pageTitle = `${readingTypeLabel} ${readingStatusLabel}`

    //Identifica la combinación que se está mostrando.
    const currentFilter = `${readingType}-${readingStatus}`

    //Si loadedFilter no coincide con la URL actual, la lista nueva está cargando.
    const isLoading = loadedFilter !== currentFilter

    //Carga las lecturas correspondientes cada vez que se cambia la ruta.
    useEffect(() => {
        //Evita actualizar si el componente se desmonta.
        let isMounted = true

        async function loadReadings() {
            //Consulta solo las consultas de la vista concreta. cover_url y read_month se renonmbran para 
            //mantener los que camelCase que usa el JSX.
            const { data, error } = await supabase
                .from('tomes')
                .select(`
                    id,
                    title,
                    author,
                    type,
                    status,
                    coverUrl:cover_url,
                    synopsis,
                    readMonth:read_month,
                    rating,
                    review
                `)
                .eq('type', readingType)
                .eq('status', readingStatus)
                .order('created_at', { ascending: false })
            
            //Si la página ya no está montada, no actualiza estados.
            if (!isMounted) {
                return
            }

            //Si falla la consulta, limpia la lista y muestra error.
            if (error) {
                console.error('Error al cargar las lecturas:', error.message)
                setReadings([])
                setErrorMessage('No se han podido cargar las lecturas.')
                setLoadedFilter(currentFilter)
                return
            }
            
            //Guarda las lecturas reales y marca la consulta como terminada.
            setReadings(data ?? [])
            setErrorMessage('')
            setLoadedFilter(currentFilter)
        }
        void loadReadings()

        //Evita actualizaciones tardías si el componente se desmonta.
        return () => {
            isMounted = false
        }
    },[currentFilter, readingStatus, readingType])

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

                {/*Estado de carga de la lista actual.*/}
                {isLoading && (
                    <p>Cargando lecturas...</p>
                )}

                {/*Mensaje si falla la consulta.*/}
                {!isLoading && errorMessage && (
                    <p>{errorMessage}</p>
                )}

                {/*Mensaje si la lista todavía no tiene lecturas.*/}
                {!isLoading && !errorMessage && readings.length === 0 && (
                    <p>Todavía no has guardado nada en esta lista.</p>
                )}

                {/*Lecturas reales recibidas desde Supabase.*/}
                {!isLoading && !errorMessage && readings.length > 0 && (
                    <section
                        className={
                            viewMode === 'grid'
                            ? styles.readingGrid
                            : styles.readingList
                        }
                    >
                        {readings.map((reading) => (
                            <article className={styles.readingCard} key={reading.id}>
                                {/*Portada para la vista en tarjetas.*/}
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
                                    <h2>{formatTittle(reading.title)}</h2>

                                    <p className={styles.author}>
                                        {formatAuthor(reading.author)}
                                    </p>

                                    {/*Información completa para la vista tarjeta.*/}
                                    {viewMode === 'grid' && (
                                        <>
                                            <p className={styles.synopsis}>
                                                {reading.synopsis || 'Sin sinopsis disponible.'}
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

                                    {/*En vista lista solo cargará la fecha si existe.*/}
                                    {viewMode === 'list' && reading.readMonth && (
                                        <p className={styles.listDate}>
                                            Leído en {reading.readMonth}
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>
        </div>
    )
}

export default ReadingListPage
