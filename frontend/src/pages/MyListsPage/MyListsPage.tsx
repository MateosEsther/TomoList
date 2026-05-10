import { Link } from 'react-router'
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    CalendarDays,
} from 'lucide-react'
import styles from './MyListsPage.module.scss'

function MyListsPage() {
    return (
        <div className={styles.myListsPage}>
            {/*Sidebar lateral*/}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <BookOpen aria-hidden="true" />
                    <strong>TomoList</strong>
                </div>

                {/*Bloque de usuario.*/}
                <section className={styles.userBox}>
                    <div className={styles.userAvatar} aria-hidden="true">
                        E
                    </div>
                    <div>
                        <p className={styles.userName}>Esther</p>
                        <p className={styles.userIcon}>usuario@tomolist.com</p>
                    </div>
                </section>

                {/*Navegación interna.*/}
                <nav className={styles.sidebarNav} aria-label="Navegación principal">
                    <Link to="/mis-listas">Mis listas</Link>
                    <Link to="/mis-listas">Pendientes</Link>
                    <Link to="/mis-listas">Leídas</Link>
                    <Link to="/mis-listas">Mi perfil</Link>
                </nav>

                {/*Añadir tomo.*/}
                <Link className={styles.addTomeLink} to="/anadir-tomo">
                    <Plus aria-hidden="true" />
                    Añadir tomo
                </Link>
            </aside>

            {/*Contenido principal.*/}
            <main className={styles.content}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1>Mis listas</h1>
                        <p>Consulta, filtra y organiza tus lecturas de manga y literatura.</p>
                    </div>
                </header>

                {/*Accesos visuales a las princiaples listas.*/}
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
                            Fecha de finalización disponible en cada lectura
                        </span>
                    </article>

                    <article className={styles.listCard}>
                        <h2>Literatura leída</h2>
                        <p>Libros terminados con fecha, valoración y comentario.</p>

                        <span className={styles.dateInfo}>
                            <CalendarDays aria-hidden="true" />
                            Fecha de finalización disponible en cada lectura
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
                                <option value="all">Manga</option>
                                <option value="all">Literatura</option>
                            </select>
                        </label>

                        <label>
                            Estado
                            <select defaultValue="all">
                                <option value="all">Todos</option>
                                <option value="all">Pendiente</option>
                                <option value="all">Leído</option>
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