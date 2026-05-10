//Trae de React la función useState para que un componente recuerde un valor mientras usa la app
//y lo renderiza con el nuevo estado.
import { useState } from 'react';
import { Link } from 'react-router'
import {
    BookOpen,
    Plus,
} from 'lucide-react'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import styles from './AddTomePage.module.scss'

function AddTomePage() {
    //Guardar el estado seleccionado o vacío si todavía no ha elegido nada.
    const [readingStatus, setReadingStatus] = useState('')

    //Para saber cuándo mostrar los campos adicionales en estado leída. 
    //Si selecciona read, isRead vale true, si no, vale false.
    const isRead = readingStatus === 'read'

    return (
        <div className={styles.addTomePage}>
            {/*Sidebar lateral.*/}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <BookOpen aria-hidden="true" />
                    <strong>TomoList</strong>
                </div>

                <section className={styles.userBox}>
                    <div className={styles.userAvatar} aria-hidden="true">
                        E
                    </div>
                    <div>
                        <p className={styles.userName}>Esther</p>
                        <p className={styles.userEmail}>usuario@tomolist.com</p>
                    </div>
                </section>

                <nav className={styles.sidebarNav} aria-label="Navegación principal">
                    <Link to="/mis-listas">Mis listas</Link>
                    <Link to="/mis-listas">Pendientes</Link>
                    <Link to="/mis-listas">Leídas</Link>
                    <Link to="/mis-listas">Mi perfil</Link>
                </nav>

                <Link className={styles.addTomeLink} to="/anadir-tomo">
                    <Plus aria-hidden="true" />
                    Añadir tomo
                </Link>
            </aside>
        
            {/*Contenido principal*/}
            <main className={styles.content}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1>Añadir tomo</h1>

                        <p>
                            Registra una lectura nueva, ya sea pendiente o que forme parte de tu lista de leídas.
                        </p>
                    </div>
                </header>

                <section className={styles.formCard}>
                    <form className={styles.tomeForm}>
                        <div className={styles.formGrid}>

                            <div className={styles.field}>
                                <label htmlFor="title">Título</label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Nombre del manga o libro"
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="author">Autor/a</label>
                                <input
                                    id="author"
                                    type="text"
                                    placeholder="Autor o autora"
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="type">Tipo de lectura</label>
                                <select id="type" defaultValue="">
                                    <option value="" disabled>
                                        Selecciona un tipo
                                    </option>
                                    <option value="manga">Manga</option>
                                    <option value="literature">Literatura</option>
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="status">Estado</label>
                                {/*Estado controlado con React. Al cambiar el estado, actualiza readingStatus.*/}
                                <select
                                    id="status"
                                    value={readingStatus}
                                    onChange={(event) => setReadingStatus(event.target.value)}
                                >
                                    <option value="" disabled>
                                        Selecciona un estado
                                    </option>
                                    <option value="pending">Pendiente</option>
                                    <option value="read">Leída</option>
                                </select>
                            </div>
                        </div>

                        {/*Se muestran solo con estado "leída".*/}
                        {isRead && (
                            <section className={styles.readFields}>
                                <div className={styles.field}>
                                    <label htmlFor="readMonth">Leído en</label>
                                    <input
                                        id="readMonth"
                                        type="month"
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="rating">Valoración</label>
                                    <select id="rating" defaultValue="" required>
                                        <option value="" disabled>
                                            Selecciona una valoración
                                        </option>
                                        <option value="1">1 estrella</option>
                                        <option value="2">2 estrellas</option>
                                        <option value="3">3 estrellas</option>
                                        <option value="4">4 estrellas</option>
                                        <option value="5">5 estrellas</option>
                                    </select>
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="review">Reseña</label>
                                    <textarea
                                        id="review"
                                        placeholder="Escribe una reseña o nota personal sobre esta lectura."
                                    />
                                </div>
                            </section>
                        )}

                        <PrimaryButton>Guardar tomo</PrimaryButton>

                    </form>
                </section>
            </main>
        </div>
    )
}

export default AddTomePage