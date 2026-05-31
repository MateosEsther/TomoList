//Trae de React la función useState para que un componente recuerde un valor mientras usa la app
//y lo renderiza con el nuevo estado.
import { useState } from 'react';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar';
import styles from './AddTomePage.module.scss'
import { supabase } from '../../lib/supabaseClient';
import { useProfile } from '../../hooks/useProfile';
import { Star } from 'lucide-react'


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

    //Para saber cuándo mostrar los campos adicionales en estado leída. 
    //Si selecciona read, isRead vale true, si no, vale false.
    const isRead = readingStatus === 'read'

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

        //Limpia espacios innecesarios.
        const title = String(formData.get('title') ?? '').trim()
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
                        <h1>Añadir tomo</h1>

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
                                    />
                                </div>
                            </section>
                        )}

                        <PrimaryButton type="submit">Guardar tomo</PrimaryButton>

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