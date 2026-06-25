import { useEffect, useState } from 'react'
import {
    Search,
    Filter,
    CalendarDays,
} from 'lucide-react'
import { Link } from 'react-router'
import styles from './MyListsPage.module.scss'
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar'
import { formatTitle, formatAuthor } from '../../utils/text'
import { supabase } from '../../lib/supabaseClient'

//Datos de lectura recogidos de Supabase para la info de conteos, filtros...
type ReadingItem = {
    id: string
    title: string
    author: string
    type: 'manga' | 'literature'
    status: 'pending' | 'read'
}

//Reprensentación de todos los conteos posibles.
type ReadingCounts = {
    total: number
    pending: number
    read: number
    mangaPending: number
    mangaRead: number
    literaturePending: number
    literatureRead: number
}

//Estado inicial de los conteos. Fuera del componente para reuutilizarlo en caso de error.
const initialReadingCounts: ReadingCounts = {
    total: 0,
    pending: 0,
    read: 0,
    mangaPending: 0,
    mangaRead: 0,
    literaturePending: 0,
    literatureRead: 0,
}

function MyListsPage() {

    //Guarda conteos calculados a partir de las lecturas.
    const [readingCounts, setReadingCounts] = useState<ReadingCounts>(initialReadingCounts)

    //Estado "Cargando..." al cargar la vista.
    const [isLoadingCounts, setIsLoadingCounts] = useState(true)

    //Guarda mensaje de error si falla la consulta a Supabase.
    const [countsErrorMessage, setCountsErrorMessage] = useState('')

    //Guarda los valores introducidos en el buscador.
    //all es para ambas opciones del selector.
    const [searchItem, setSearchItem] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    //Para todas las lecturas.
    const [showAllResults, setShowAllResults] = useState(false)


    //Guarda las lecturas recuperdas de Supabase para calcular qué resultados coinciden con los filtros.
    const [readings, setReadings] = useState<ReadingItem[]>([])

    //Carga todas las lecturas necesarias para calcular los conteos de mis listas.
    useEffect(() => {
        //Evita actualizar estados si el componente se desmonta antes de terminar la consulta.
        let isMounted = true

        async function loadReadingCounts() {
            //Marcamos que empieza la carga de datos.
            setIsLoadingCounts(true)

            //Trae los campos necesarios.
            const { data, error } = await supabase
                .from('tomes')
                .select(`
                    id,
                    title,
                    author,
                    type,
                    status
                `)
            
            //Si el componente no está montado, no actualiza
            if (!isMounted) {
                return
            }

            //Si Supabase devuelve error.
            if (error) {
                //Limpia datos porque no hay consukta correcta.
                setReadings([])

                setReadingCounts(initialReadingCounts)
                setCountsErrorMessage('No se han podido cargar las lecturas.')
                setIsLoadingCounts(false)

                return
            }

            //Conversión de los datos para que los lea TypeScript.
            const loadedReadings = (data ?? []) as ReadingItem[]

            //Calcula los conteos recorriendo las lecturas una sola vez.
            const nextCounts = loadedReadings.reduce<ReadingCounts>((accumulator, reading) => {
                //Todas las lecturas suman al total genera.
                accumulator.total += 1

                //Conteo por estado.
                if (reading.status === 'pending') {
                    accumulator.pending += 1
                }
                if (reading.status === 'read') {
                    accumulator.read += 1
                }

                //Conteo por tipo y estado.
                if (reading.type === 'manga' && reading.status === 'pending') {
                    accumulator.mangaPending += 1
                }
                if (reading.type === 'manga' && reading.status === 'read') {
                    accumulator.mangaRead += 1
                }

                if (reading.type === 'literature' && reading.status === 'pending') {
                    accumulator.literaturePending += 1
                }
                if (reading.type === 'literature' && reading.status === 'read') {
                    accumulator.literatureRead += 1
                }

                return accumulator
            }, { ...initialReadingCounts})

            //Guarda lecturas completas para filtrarlas en la interfaz.
            setReadings(loadedReadings)

            //Guarda en el estado los conteos calculados.
            setReadingCounts(nextCounts)

            //Limpia errores anteriores si la consulta ha ido bien.
            setCountsErrorMessage('')

            //Termina la carga.
            setIsLoadingCounts(false)            
        }

        void loadReadingCounts()

        //Limpieza del useEffect que ejecuta React si el componente se desmonta.
        return () => {
            isMounted = false
        }
    }, [])

    //Restablece la vista al estado inicial:
    function handleClearFilters() {
        setSearchItem('')
        setTypeFilter('all')
        setStatusFilter('all')
        setShowAllResults(false)
    }

    //Normaliza la busqueda para ignorar espeacios y diferencias entre mayúsculas y minúsculas.
    const normalizedSearchItem = searchItem.trim().toLocaleLowerCase()

    //Para indicar si se ha activado algún filtro. Si no, no muestra resultados.
    const hasActiveFilters =
        normalizedSearchItem !== '' ||
        typeFilter !== 'all' ||
        statusFilter !== 'all'

    //Resultados de filtrado aparecen si hay filtro activo o "todas las lecturas".
    const shouldShowResults = hasActiveFilters || showAllResults

    //Nueva lista con las lecturas que cumplen con los filtros.
    const filteredReadings = readings.filter((reading) => {
        //Normaliza título almacenado para comprar con la búsqueda.
        const normalizedTitle = reading.title.toLowerCase()

        //Si autor es null, utiliza cadena vacía para evitar errores.
        const normalizedAuthor = reading.author.toLowerCase()

        //Coincidencia si: vacío, título o autor.
        const matchesSearch =
            normalizedSearchItem === '' ||
            normalizedTitle.includes(normalizedSearchItem) ||
            normalizedAuthor.includes(normalizedSearchItem)

        //Tipo coincide si está seleccionado "Todos" o si tiene el tipo seleccionado.
        const matchesType =
            typeFilter === 'all' ||
            reading.type === typeFilter

        //Estado coincide si está seleccionado "Todos" o si tiene estado seleccionado.
        const matchesStatus =
            statusFilter === 'all' ||
            reading.status === statusFilter

        //Lectura solo aparece si cumple simultáneamente la búsqueda, el tipo y el estado.
        return matchesSearch && matchesType && matchesStatus
    })

    return (
        <div className={styles.myListsPage}>
            {/*Llama al privateSidebar importado de componentes.*/}
            <PrivateSidebar />

            {/*Contenido principal.*/}
            <main className={styles.content}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1>Mis listas</h1>
                        <p>Consulta, filtra y organiza tus lecturas de manga y literatura.</p>
                    </div>
                </header>
            
                {/*Si la carga de conteo falla, muestra error.*/}
                {countsErrorMessage && (
                    <p className={styles.errorMessage}>
                        {countsErrorMessage}
                    </p>
                )}

                {/*Accesos visuales a las principales listas.*/}
                <section className={styles.listsGrid}>
                    <Link 
                        className={styles.listCard}
                        to="/listas/manga/pending">
                        <h2>Manga pendientes</h2>
                        <p>Lecturas de manga por empezar o continuar.</p>

                        <strong className={styles.cardCount}>
                            {isLoadingCounts ? 'Cargando...' : `${readingCounts.mangaPending} lecturas`}
                        </strong>

                        <span className={styles.dateInfo}>
                            <CalendarDays aria-hidden="true" />
                            Última actualización pendiente
                        </span>
                    </Link>

                    <Link 
                        className={styles.listCard}
                        to="/listas/literature/pending">
                        <h2>Literatura pendientes</h2>
                        <p>Libros guardados para leer más adelante.</p>

                        <strong className={styles.cardCount}>
                            {isLoadingCounts ? 'Cargando...' : `${readingCounts.literaturePending} lecturas`}
                        </strong>

                        <span className={styles.dateInfo}>
                            <CalendarDays aria-hidden="true" />
                            Última actualización pendiente
                        </span>
                    </Link>

                    <Link 
                        className={styles.listCard}
                        to="/listas/manga/read">
                        <h2>Manga leídas</h2>
                        <p>Mangas terminados, valoraciones y reseñas guardadas.</p>

                        <strong className={styles.cardCount}>
                            {isLoadingCounts ? 'Cargando...' : `${readingCounts.mangaRead} lecturas`}
                        </strong>

                        <span className={styles.dateInfo}>
                            <CalendarDays aria-hidden="true" />
                            Información de lectura disponible en cada registro
                        </span>
                    </Link>

                    <Link 
                        className={styles.listCard}
                        to="/listas/literature/read">
                        <h2>Literatura leídas</h2>
                        <p>Libros terminados con fecha, valoración y comentario.</p>

                        <strong className={styles.cardCount}>
                            {isLoadingCounts ? 'Cargando...' : `${readingCounts.literatureRead} lecturas`}
                        </strong>

                        <span className={styles.dateInfo}>
                            <CalendarDays aria-hidden="true" />
                            Información de lectura disponible en cada registro
                        </span>
                    </Link>
                </section>

                    {/*Zona búsqueda y filtros.*/}
                <section className={styles.toolsPanel}>
                    {/*Icono bloque filtros.*/}
                    <div className={styles.filtersIcon}>
                        <Filter aria-hidden="true" />
                    </div>

                    <div className={styles.searchBox}>
                        <Search aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Busca por título o autora/o"
                            //Contenido del buscador es del estado de React
                            value={searchItem}
                            //Con cada cambio de texto, guarda el valor en el estado
                            onChange={(event) => setSearchItem(event.target.value)}
                        />
                    </div>

                    <div className={styles.filters}>
                        <label>
                            Tipo
                            <select 
                                //Opción visible desde el estado de React.
                                value={typeFilter}
                                //Guarda la opción seleccionada.
                                onChange={(event) => setTypeFilter(event.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="manga">Manga</option>
                                <option value="literature">Literatura</option>
                            </select>
                        </label>

                        <label>
                            Estado
                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="pending">Pendiente</option>
                                <option value="read">Leído</option>
                            </select>
                        </label>
                    </div>

                    <div className={styles.filterActions}>
                        <button
                            type="button"
                            onClick={() => setShowAllResults(true)}
                        >
                            Todas mis lecturas
                        </button>

                        <button
                            type="button"
                            onClick={handleClearFilters}
                        >
                            Limpiar filtros        
                        </button>
                    </div>
                </section>

                {/*Muestra zona de resultados con filtro activo.*/}
                {shouldShowResults && (
                    <section className={styles.resultsSection}>
                        <h2 className={styles.resultsTitle}>Resultados</h2>

                        {/*Durante la carga no muestra resultados incompletos.*/}
                        {isLoadingCounts ? (
                            <p className={styles.resultsMessage}>Cargando resultados...</p>
                        ) : filteredReadings.length === 0 ? (
                            //Se muestra cuando ningún registro cumple los filtros.
                            <p className={styles.resultsMessage}>
                                No se han encontrado lecturas. Inténtalo otra vez.
                            </p>
                        ) : (
                            //Recorre las lecturas filtradas y crea un resultado por cada una.
                            <div className={styles.resultsList}>
                                {filteredReadings.map((reading) => (
                                    <article 
                                        key={reading.id}
                                        className={styles.resultCard}
                                    >
                                        <h3 className={styles.resultTitle}>
                                            {formatTitle(reading.title)}
                                        </h3>

                                        <div className={styles.resultMeta}>
                                            <span>{formatAuthor(reading.author)}</span>

                                            <span>
                                                {reading.type === 'manga'
                                                    ? 'Manga'
                                                    : 'Literatura'}
                                            </span>

                                            <span>
                                                {reading.status === 'pending'
                                                    ? 'Pendiente'
                                                    : 'Leído'}
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/*Resumen.*/}
                <section className={styles.summaryGrid}>
                    <article>
                        <strong>
                            {isLoadingCounts ? '...' : readingCounts.total}
                        </strong>
                        <span>Total lecturas</span>
                    </article>

                    <article>
                        <strong>
                            {isLoadingCounts ? '...' : readingCounts.pending}
                        </strong>
                        <span>Pendientes</span>
                    </article>

                    <article>
                        <strong>
                            {isLoadingCounts ? '...' : readingCounts.read}
                        </strong>
                        <span>Leídas</span>
                    </article>
                </section>

            </main>
        </div>
    )
}

export default MyListsPage