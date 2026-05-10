import {
    Search,
    Filter,
    CalendarDays,
} from 'lucide-react'
import styles from './MyListsPage.module.scss'
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar'

function MyListsPage() {
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

                {/*Accesos visuales a las principales listas.*/}
                <section className={styles.listsGrid}>
                    <article className={styles.listCard}>
                        <h2>Manga pendiente</h2>
                        <p>Lecturas de manga por empezar o continuar.</p>

                        <span className={styles.dateInfo}>
                            <CalendarDays aria-hidden="true" />
                            Última actualización pendiente
                        </span>
                    </article>

                    <article className={styles.listCard}>
                        <h2>Literatura pendiente</h2>
                        <p>Libros guardados para leer más adelante.</p>

                        <span className={styles.dateInfo}>
                            <CalendarDays aria-hidden="true" />
                            Última actualización pendiente
                        </span>
                    </article>

                    <article className={styles.listCard}>
                        <h2>Manga leído</h2>
                        <p>Mangas terminados, valoraciones y reseñas guardadas.</p>

                        <span className={styles.dateInfo}>
                            <CalendarDays aria-hidden="true" />
                            Información de lectura disponible en cada registro
                        </span>
                    </article>

                    <article className={styles.listCard}>
                        <h2>Literatura leída</h2>
                        <p>Libros terminados con fecha, valoración y comentario.</p>

                        <span className={styles.dateInfo}>
                            <CalendarDays aria-hidden="true" />
                            Información de lectura disponible en cada registro
                        </span>
                    </article>
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
                        <strong>0</strong>
                        <span>Total lecturas</span>
                    </article>

                    <article>
                        <strong>0</strong>
                        <span>Pendientes</span>
                    </article>

                    <article>
                        <strong>0</strong>
                        <span>Leídas</span>
                    </article>
                </section>

            </main>
        </div>
    )
}

export default MyListsPage