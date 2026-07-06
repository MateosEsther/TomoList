//Trae de React la función useState para que un componente recuerde un valor mientras usa la app
//y lo renderiza con el nuevo estado.
import { useState } from 'react';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar';
import styles from './AddTomePage.module.scss'
import { supabase } from '../../lib/supabaseClient';
import { useProfile } from '../../hooks/useProfile';
import { formatTitle, formatAuthor, stripHTML } from '../../utils/text';
import { Star } from 'lucide-react'
import { searchGoogleBooks } from '../../services/searchGoogleBooks';
import type { GoogleBookResult } from '../../services/searchGoogleBooks';

function AddTomePage() {
    //Guardar el estado seleccionado o vacío si todavía no ha elegido nada.
    const [readingStatus, setReadingStatus] = useState('')

    //Guarda la valoración elegida entre 0 y 5 estrellas.
    const [rating, setRating] = useState(0)

    //Obtiene el id del user autenticado desde el contexto global.
    const { userId } = useProfile()

    //Guarda mensajes de error o éxito.
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    //Guarda los resultados de la búsquedas en las APIs.
    const [searchResults, setSearchResults] = useState<GoogleBookResult[]>([])
    //True mientras espera la respuesta de las APIs.
    const [isSearching, setIsSearching] = useState(false)
    //Errores de búsqieda (validaciones, API o sin resultados)..
    const [searchErrorMessage, setSearchErrorMessage] = useState('')
    //Resultado del catálogo de las búsquedas elegible antes de guardar.
    const [selectedBook, setSelectedBook] = useState<GoogleBookResult | null>(null)

    //Para saber cuándo mostrar los campos adicionales en estado leída. 
    //Si selecciona read, isRead vale true, si no, vale false.
    const isRead = readingStatus === 'read'


    //Busca en el catálogo según el tipo: Google Books (literatura) o AniList (manga, pendiente).
    async function handleSearch() {
        setSearchErrorMessage('')
        setSearchResults([])
        setSelectedBook(null)

        const form = document.querySelector('form') as HTMLFormElement | null
        if (!form) {
            return
        }

        const formData = new FormData(form)
        const title = String(formData.get('title') ?? '').trim()
        const author = String(formData.get('author') ?? '').trim()
        const tomeType = String(formData.get('type') ?? '')

        if (!tomeType) {
            setSearchErrorMessage('Selecciona un tipo de lectura antes de buscar.')
            return
        }

        if (!title && !author) {
            setSearchErrorMessage('Escribe título o autora/o para buscar.')
            return
        }

        const query = [title, author].filter(Boolean).join(' ')

        setIsSearching(true)

        try {
            let results: GoogleBookResult[] = []

            //Según el tipo elegido, busca en la API correspondiente.
            if (tomeType === 'literature') {
                results = await searchGoogleBooks(query)
            } else if (tomeType === 'manga') {
                setSearchErrorMessage('La búsqueda de manga estará disponible al integrar AniList.')
                return
            }

            setSearchResults(results)

            if (results.length === 0) {
                setSearchErrorMessage('No se encontraron resultados. Puedes guardar la lectura manualmente.')
            }

        } catch {
            setSearchErrorMessage('No se ha podido buscar en el catálogo.')
        } finally {
            setIsSearching(false)
        }
    }

    //selectedBook guarda el resultado del catálogo elegido y rellena los campos con el formato de la app.
    function handleSelectedBook(book: GoogleBookResult) {
        setSelectedBook(book)

        const form = document.querySelector('form') as HTMLFormElement | null
        if(!form) {
            return
        }

        //Busca los inputs de title y author del form.
        const titleInput = form.elements.namedItem('title') as HTMLInputElement | null
        const authorInput = form.elements.namedItem('author') as HTMLInputElement | null

        if(titleInput) {
            titleInput.value = book.title.trim()
        }
        if(authorInput) {
            authorInput.value = formatAuthor(book.author)
        }
    }


    //Guarda una obra nueva en Supabase.
    async function handleAddTome(event: React.FormEvent<HTMLFormElement>) {
        //Evita que recarge la página.
        event.preventDefault()

        //Limpia mensajes anteriores.
        setErrorMessage('')
        setSuccessMessage('')

        //Sin id, no se puede asociar una obra a un user.
        if (!userId) {
            setErrorMessage('No se ha podido guardar la lectura. Recarga la página e inténtalo de nuevo.')
            return
        }

        //Guarda una referencia al form para limpiarlo después.
        const form = event.currentTarget

        //Recoge los valores por los atributos "name" de los campos.
        const formData = new FormData(form)

        //Limpia espacios y normaliza la capitalización del título.
        const rawTitle = String(formData.get('title') ?? '').trim()
        const title = selectedBook
            ? selectedBook.title.trim()
            : formatTitle(rawTitle)
        const author = String(formData.get('author') ?? '').trim()
        const tomeType = String(formData.get('type') ?? '')
        const tomeStatus = String(formData.get('status') ?? '')

        //Validación básica de campos obligatorios.
        if (!title || !author || !tomeType || !tomeStatus) {
            setErrorMessage('Título, autoría, tipo y estado son obligatorios.')
            return
        }
        
        //Para datos de lectura específicos del estado leído.
        const readMonthValue = String(formData.get('readMonth') ?? '').trim()
        const reviewValue = String(formData.get('review') ?? '').trim()
        const ratingValue = rating

        //Valoración obligatoria para leídas.
        if (
            tomeStatus === 'read'
            && (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5)
        ) {
            setErrorMessage('Selecciona valoración entre 1 y 5 estrellas.')
            return
        }

        //Inserta la obra asociada al user autenticado.
        const { error } = await supabase
            .from('tomes')
            .insert({
                user_id: userId,
                title,
                author,
                type: tomeType,
                status: tomeStatus,
                read_month: tomeStatus === 'read' && readMonthValue
                    ?readMonthValue
                    : null,
                rating: tomeStatus === 'read'
                    ? ratingValue
                    : null,
                review: tomeStatus === 'read' && reviewValue
                    ? reviewValue
                    : null,
                //Datos del catálogo si se seleccionó un resultado, si no, null.
                cover_url: selectedBook?.coverUrl ?? null,
                synopsis: selectedBook?.synopsis
                ? stripHTML(selectedBook.synopsis)
                : null,
            })
        
        //Si Supabase devuelve error, informa al user.
        if (error) {
            console.error('Vaya. Hay un error al guardar la lectura:', error.message)

            //Código PostgreSQL para registros duplicados.
            if (error.code === '23505') {
                setErrorMessage('Ops! Esta lectura ya está guardada en tu biblioteca.')
                return
            }

            setErrorMessage('No se ha podido guardar la lectura.')
            return
        }

        //Limpia el form tras guardar correctamente.
        form.reset()
        setReadingStatus('')
        setRating(0)
        setSearchResults([])
        setSelectedBook(null)
        setSearchErrorMessage('')

        //Informa al usuario.
        setSuccessMessage('Lectura guardada correctamente. Puedes verla en tu biblioteca.')

    }

    return (
        <div className={styles.addTomePage}>
            {/*Llama al privateSidebar reutilizable de componentes.*/}
                <PrivateSidebar />
        
            {/*Contenido principal*/}
            <main className={styles.content}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1>Añadir lectura</h1>

                        <p>
                            Registra una lectura nueva, ya sea pendiente o que forme parte de tu lista de leídas.
                        </p>
                    </div>
                </header>

                <section className={styles.formCard}>
                    <form className={styles.tomeForm} onSubmit={handleAddTome}>
                        <div className={styles.formGrid}>

                            <div className={styles.field}>
                                <label htmlFor="title">Título</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Título"
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="author">Autor/a</label>
                                <input
                                    id="author"
                                    name="author"
                                    type="text"
                                    placeholder="Autora o autor"
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="type">Tipo de lectura</label>
                                <select id="type" name="type" defaultValue="" required>
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
                                    name="status"
                                    value={readingStatus}
                                    onChange={(event) => {
                                        const newStatus = event.target.value
                                        setReadingStatus(newStatus)
                                        //Si pasa a pendiente, elimina la valoración anterior.
                                        if (newStatus !== 'read') {
                                            setRating(0)
                                        }
                                    }}
                                    required
                                >
                                    <option value="" disabled>
                                        Selecciona un estado
                                    </option>
                                    <option value="pending">Pendiente</option>
                                    <option value="read">Leída</option>
                                </select>
                            </div>
                        </div>
                        
                        {/*Búsqueda en catálgo externo (APIs).*/}
                        <div className={styles.catalogSearch}>
                            {/*Llama al handleSearch() con title, author y type del fomr.*/}
                            <button 
                                type="button"
                                className={styles.catalogSearchButton}
                                onClick={() => void handleSearch()}
                                disabled={isSearching}
                            >
                                {isSearching ? 'Buscando...' : 'Buscar en catálogo'}
                            </button>

                            {/*Validaciones, errores de API o sin resultados.*/}
                            {searchErrorMessage && (
                                <p className={styles.errorMessage} role="status">
                                    {searchErrorMessage}
                                </p>
                            )}

                            {/*Lista de resultados del catálogo, solo si searchResults tiene datos.*/}
                            {searchResults.length > 0 && (
                                <ul className={styles.catalogResults}>
                                    {searchResults.map((book) =>{
                                        //Compara title y author para resaltar la obra seleccionada.
                                        const isSelected =
                                            selectedBook?.title === book.title
                                            && selectedBook?.author === book.author

                                        return (
                                            <li key={`${book.title}-${book.author}`}>
                                                {/*Evita enviar el form al elegir.*/}
                                                <button
                                                    type="button"
                                                    className={
                                                        isSelected
                                                            ? `${styles.catalogResultItem} ${styles.catalogResultItemSelected}`
                                                            : styles.catalogResultItem
                                                    }
                                                    onClick={() => handleSelectedBook(book)}
                                                >
                                                    {/*Opcional porque no todas se pueden traer de las APIs.*/}
                                                    {book.coverUrl && (
                                                        <img
                                                            src={book.coverUrl}
                                                            alt=""
                                                            className={styles.catalogResultCover}
                                                        />
                                                    )}

                                                    <span className={styles.catalogResultText}>
                                                        <strong>{book.title}</strong>
                                                        <span>{book.author}</span>
                                                    </span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}

                            {/*Vista previa de la sinopsis de la obra seleccionada.*/}
                            {selectedBook && (
                                <p className={styles.catalogSynopsis}>
                                    {selectedBook.synopsis && stripHTML(selectedBook.synopsis)}
                                </p>
                            )}
                        </div>

                        {/*Se muestran solo con estado "leída".*/}
                        {isRead && (
                            <section className={styles.readFields}>
                                <div className={styles.field}>
                                    <label htmlFor="readMonth">Leído en</label>
                                    <input
                                        id="readMonth"
                                        name="readMonth"
                                        type="month"
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label>Valoración</label>

                                    {/*Selector de estrellas.*/}
                                    <div
                                        className={styles.ratingStars}
                                        role="radiogroup"
                                        aria-label="Valoración de la lectura"
                                    >
                                        {[1, 2, 3, 4, 5].map((starValue) => (
                                            <button
                                                className={styles.ratingStar}
                                                type="button"
                                                role="radio"
                                                aria-checked={rating === starValue}
                                                aria-label={`${starValue} ${starValue === 1 ? 'estrella' : 'estrellas'}`} 
                                                key={starValue}
                                                onClick={() => setRating(starValue)}
                                            >
                                                <Star
                                                    aria-hidden="true"
                                                    className={
                                                        starValue <= rating
                                                            ? styles.ratingStarSelected
                                                            : undefined
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="review">Reseña</label>
                                    <textarea
                                        id="review"
                                        name="review"
                                        placeholder="Escribe una reseña o nota personal sobre esta lectura."
                                        spellCheck={true}
                                    />
                                </div>
                            </section>
                        )}

                        <PrimaryButton type="submit">Guardar lectura</PrimaryButton>

                        {/*Mensajes posibles al pulsar guardar.*/}
                        {errorMessage && (
                            <p className={styles.errorMessage}>
                                {errorMessage}
                            </p>
                        )}
                        {successMessage && (
                            <p className={styles.successMessage}>
                                {successMessage}
                            </p>
                        )}
                    </form>
                </section>
            </main>
        </div>
    )
}

export default AddTomePage