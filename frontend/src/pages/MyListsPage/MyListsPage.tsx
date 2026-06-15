import { useEffect, useState } from 'react'
import {
    Search,
    Filter,
    CalendarDays,
} from 'lucide-react'
import { Link } from 'react-router'
import styles from './MyListsPage.module.scss'
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar'
import { supabase } from '../../lib/supabaseClient'

//Datos mínimos a recoger de Supabase para los conteos.
type ReadingCoutItem = {
    id: number
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
                    type,
                    status
                `)
            
            //Si el componente no está montado, no actualiza
            if (!isMounted) {
                return
            }

            //Si Supabase devuelve error, limpia conteos y mensaje de error.
            if (error) {
                console.error('Error al cargar los conteos:', error.message)
                setReadingCounts(initialReadingCounts)
                setCountsErrorMessage('No se han podido cargar los conteos de las lecturas.')
                setIsLoadingCounts(false)
                return
            }

            //Conversión de los datos para que los lea TypeScript.
            const readings = (data ?? []) as ReadingCoutItem[]

            //Calcula los conteos recorriendo las lecturas una sola vez.
            const nextCounts = readings.reduce<ReadingCounts>((accumulator, reading) => {
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
                        to="/listas/manga/pendientes">
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
                        to="/listas/literatura/pendientes">
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
                        to="/listas/manga/leidas">
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
                        to="/listas/literatura/leidas">
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
                    <div className={styles.searchBox}>
                        <Search aria-hidden="true" />

                        <input
                            type="search"
                            placeholder="Busca por título o autor"
                        />
                    </div>

                    <div className={styles.filters}>
                        <label>
                            <Filter aria-hidden="true" />
                            Tipo
                            <select defaultValue="all">
                                <option value="all">Todos</option>
                                <option value="manga">Manga</option>
                                <option value="literature">Literatura</option>
                            </select>
                        </label>

                        <label>
                            Estado
                            <select defaultValue="all">
                                <option value="all">Todos</option>
                                <option value="pending">Pendiente</option>
                                <option value="read">Leído</option>
                            </select>
                        </label>
                    </div>
                </section>

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