//Página reutilizable para mostrar una lista concreta de lecturas.
//La lista se decide a partir de la URL: /listas/:type/:status.

//Guarda el modo vista activo.
import { useEffect, useState } from 'react';
//Para crear una ruta dinámica en función del tipo de lectura y el estatus.
import { useParams } from 'react-router';
import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar';
import styles from './ReadingListPage.module.scss'
import { supabase } from '../../lib/supabaseClient';
import { formatAuthor } from '../../utils/text';
import { formatReadMonth } from '../../utils/dates';
import { Star } from 'lucide-react'


//Valores posibles del modo vista. En grid con toda la información de las lecturas o en list con información reducida.
type ViewMode = 'grid' | 'list'

//Campo por el que se ordena la lista en Supabase.
type SortOrder = 'created_at' | 'updated_at'

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

    //Guarda el criterio de ordenación de la lista.
    const [sortOrder, setSortOrder] = useState<SortOrder>('created_at')

    //Guarda lecturas traídas de Supabase.
    const [readings, setReadings] = useState<Reading[]>([])

    //Guarda el filtro de la consulta terminada. Informa si la lista sigue cargando.
    const [loadedFilter, setLoadedFilter] = useState('')

    //Guarda mensaje si falla la consulta.
    const [errorMessage, setErrorMessage] = useState('')

    //Confirmación antes de cambiar estado y perder datos.
    const [showPendingConfirmation, setShowPendingConfirmation] = useState(false)

    //Guarda la lectura seleccionada para editarla. Si vale null, modal no se abre.
    const [selectedReading, setSelectedReading] = useState<Reading | null>(null)

    //Guardar el estado editable de la lectura seleccionada, pendiente o leída.
    const [editStatus, setEditStatus] = useState<Reading['status']>('pending')

    //Guarda el mes de lectura editable.
    const [editReadMonth, setEditReadMonth] = useState('')

    //Guarda la valoración editable entre 0 y 5 estrellas.
    const [editRating, setEditRating] = useState(0)

    //Guarda la reseña editable.
    const [editReview, setEditReview] = useState('')

    //Guarda mensaje por si falla la edición de lectura.
    const [editErrorMessage, setEditErrorMessage] = useState('')

    //Guarda lectura a eliminar. Si es null, el modal de confirmación de borrado no se abre.
    const [readingToDelete, setReadingToDelete] = useState<Reading | null>(null)

    //Guarda mensaje si falla al eliminar.
    const [deleteErrorMessage, setDeleteErrorMessage] = useState('')

    //Guarda mensaje de éxito el eliminar.
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('')
    
    //Id de la lectura para sinopsis desplegada; null si no hay niguna.
    const [expandedSynopsisId, setExpandedSynopsisId] = useState<string | null>(null)
    
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

    //Apertura y cierra (y limpia lectura) la función modal.
    function openEditModal(reading: Reading) {
        //Guarda la obra concreta que se va a editar.
        setSelectedReading(reading)

        //Carga datos actuales dentro del selector editable.
        setEditStatus(reading.status)
        setEditReadMonth(reading.readMonth ?? '')
        setEditRating(reading.rating ?? 0)
        setEditReview(reading.review ?? '')

        //Limpia errores anteriores.
        setEditErrorMessage('')

        //Confirmación para el usuario.
        setShowPendingConfirmation(false)
    }

    function closeEditModal() {
        setSelectedReading(null)
        setEditErrorMessage('')
        setShowPendingConfirmation(false)
    }

    //Abre y cierra la sinopsis para poder verla completa.
    function toggleSynopsis(readingId: string) {
        setExpandedSynopsisId((currentId) => {
            return currentId === readingId ? null : readingId
        })
    }

    //Guarda los cambios sobre una lectura previa.
    async function handleUpdateReading(){
        //Sin seleccionar lectura, no hace nada.
        if (!selectedReading) {
            return
        }

        //Limpia errores anteriores.
        setEditErrorMessage('')

        //Si pasa de leída a pendiente, confirmación por la eliminación de datos.
        if (
            selectedReading.status === 'read'
            && editStatus === 'pending'
            && !showPendingConfirmation
        ) {
            setShowPendingConfirmation(true)
            return
        }

        //Valoración obligatoria para estatus leídas.
        if (
            editStatus === 'read'
            && (!Number.isInteger(editRating) || editRating < 1 || editRating > 5)
        ) {
            setEditErrorMessage('Selecciona una valoración de 1 a 5 estrellas.')
            return
        }

        //Limpia espacios innecesarios de la reseña.
        const cleanReview = editReview.trim()

        //Datos finales a partir del estado elegido. Si vuelve el estado a pendiente, elimina todos los datos.
        const updateReadingData = {
            status: editStatus,
            read_month: editStatus === 'read' && editReadMonth
                ? editReadMonth
                : null,
            rating: editStatus === 'read'
                ? editRating
                : null,
            review: editStatus === 'read' && cleanReview
                ? cleanReview
                : null,
        }

        //Actualiza únicamente la lectura seleccionada.
        const { error } = await supabase
            .from('tomes')
            .update(updateReadingData)
            .eq('id', selectedReading.id)

        //Si Supabase devuelve error, informa al usuario.
        if (error) {
            console.error('Error al actualizar la lectura:', error.message)
            setEditErrorMessage('No se han podido guardar los cambios.')
            return
        }

        //Actualiza visualmente la lista actual sin volver a consultar Supabase.
        setReadings((currentReadings) => {
            //Si cambio de estado, la lectura ya no pertenece a la lista.
            if (editStatus !== readingStatus) {
                return currentReadings.filter((reading) => {
                    return reading.id !== selectedReading.id
                })
            }
            //Si mantiene el estado, actualiza los datos entro de la lista actual.
            return currentReadings.map((reading) => {
                if (reading.id !== selectedReading.id) {
                    return reading
                }

                return {
                    ...reading,
                    status: editStatus,
                    readMonth: updateReadingData.read_month,
                    rating: updateReadingData.rating,
                    review: updateReadingData.review,
                }
            })
        })
        
        //Cierra el modal tras guardar correctamente.
        closeEditModal()
    }

    //Abre modal de confirmación de lectura a eliminar.
    function openDeleteConfirmation(reading: Reading) {
        setReadingToDelete(reading)
        setDeleteErrorMessage('')
    }

    //Cierra modal de confimación sin eliminar nada.
    function closeDeleteConfirmation() {
        setReadingToDelete(null)
        setDeleteErrorMessage('')
    }

    //Eliminar lectura de la bibilioteca del usuario.
    async function handleDeleteReading() {
        //Sin lectura seleccionada no existe nada que borrar.
        if (!readingToDelete) {
            return
        }

        //Limpia errores anteriores.
        setDeleteErrorMessage('')

        //Elimina la fila seleccionada.
        const { error } = await supabase
            .from('tomes')
            .delete()
            .eq('id', readingToDelete.id)

        //Si Supabase devuelve error, mensaje al user.
        if (error) {
            console.error('Error al eliminar la lectura:', error.message)
            setDeleteErrorMessage('No se ha podido eliminar la lectura.')
            return
        }

        //Eliminar la lectura de la lista visible.
        setReadings((currentReadings) => {
            return currentReadings.filter((reading) => {
                return reading.id !== readingToDelete.id
            })
        })

        //Informa de éxito en la eliminación.
        setDeleteSuccessMessage('Lectura eliminada correctamente.')
        
        //Cierra el modal si la acción es correcta.
        closeDeleteConfirmation()
    }

    //Oculta automáticamente el mensaje de eliminación.
    useEffect(() => {
        if (!deleteSuccessMessage) {
            return
        }

        const timeout = setTimeout(() => {
            setDeleteSuccessMessage('')
        }, 3000)

        return () => {
            clearTimeout(timeout)
        }
    }, [deleteSuccessMessage])


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
                .order(sortOrder, { ascending: false })
            
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
    },[currentFilter, readingStatus, readingType, sortOrder])

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

                {/*Selector del criterio de ordenación.*/}
                <section className={styles.viewToolbar}>
                    <p>Ordenar por</p>

                    <div>
                        <button
                            type="button"
                            className={
                                sortOrder === 'created_at'
                                    ? `${styles.viewButton} ${styles.activeView}`
                                    : styles.viewButton
                            }
                            onClick={() => setSortOrder('created_at')}
                        >
                            Añadidas recientemente
                        </button>

                        <button
                            type="button"
                            className={
                                sortOrder === 'updated_at'
                                    ? `${styles.viewButton} ${styles.activeView}`
                                    : styles.viewButton
                            }
                            onClick={() => setSortOrder('updated_at')}
                        >
                            Modificadas recientemente
                        </button>
                    </div>
                </section>

                {/*Confirmación visible tras eliminar lectura.*/}
                {deleteSuccessMessage && (
                    <p className={styles.successMessage} role="status">
                        {deleteSuccessMessage}
                    </p>
                )}

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
                                    <h2>{reading.title}</h2>

                                    <p className={styles.author}>
                                        {formatAuthor(reading.author)}
                                    </p>

                                    {/*Información completa para la vista tarjeta.*/}
                                    {viewMode === 'grid' && (
                                        <>
                                            {(() => {
                                                const synopsisText = 
                                                    reading.synopsis || 'Sin sinopsis disponible.'
                                                const hasSynopsis = Boolean(reading.synopsis)
                                                const isSynopsisExpanded = 
                                                    expandedSynopsisId === reading.id

                                                return (
                                                    <div className={styles.synopsisBlock}>
                                                        <p
                                                            className={
                                                                isSynopsisExpanded
                                                                    ? styles.synopsisExpanded
                                                                    : styles.synopsis
                                                            }
                                                        >
                                                            {synopsisText}
                                                        </p>
                                                        
                                                        {hasSynopsis && (
                                                            <button
                                                                type="button"
                                                                className={styles.synopsisToggle}
                                                                onClick={() => toggleSynopsis(reading.id)}
                                                            >
                                                                {isSynopsisExpanded
                                                                    ? 'Ver menos'
                                                                    : 'Leer más'}
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            })()}

                                            <div className={styles.metaInfo}>
                                                <span>
                                                    {reading.type === 'manga' ? 'Manga' : 'Literatura'}
                                                </span>

                                                <span>
                                                    {reading.status === 'pending' ? 'Pendiente' : 'Leída'}
                                                </span>

                                                {reading.readMonth && (
                                                    <span>
                                                        Leído en {formatReadMonth(reading.readMonth)}
                                                    </span>
                                                )}

                                                {reading.rating && (
                                                    <span>
                                                        {reading.rating}/5
                                                    </span>
                                                )}
                                            </div>

                                                {reading.status === 'read' ? (
                                                    <p className={styles.review}>
                                                        {reading.review || ''}
                                                    </p>   
                                                ) : (
                                                    <hr className={styles.cardDivider} />
                                                )}
                                        </>
                                    )}

                                    {/*En vista lista solo cargará la fecha si existe.*/}
                                    {viewMode === 'list' && reading.readMonth && (
                                        <p className={styles.listDate}>
                                            Leído en {formatReadMonth(reading.readMonth)}
                                        </p>
                                    )}
                                </div>

                                {/*Acciones para las lecturas.*/}
                                <div className={styles.readingActions}>
                                    <button
                                        className={styles.editButton}
                                        type="button"
                                        onClick={() => openEditModal(reading)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className={styles.deleteButton}
                                        type="button"
                                        onClick={() => openDeleteConfirmation(reading)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                                
                            </article>
                        ))}
                    </section>
                )}

                {/*Modal de edición.*/}
                {selectedReading && (
                    <div className={styles.modalBackdrop}>
                        <section
                            className={styles.modalCard}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="edit-reading-title"
                        >
                            <h2 id="edit-reading-title"> 
                                Editar lectura
                            </h2>

                            <p className={styles.modalReadingTitle}>
                                {selectedReading.title}
                            </p>

                            {/*Estado editable de la lectura.*/}
                            <label className={styles.modalField}>
                                Estado

                                <select
                                    value={editStatus}
                                    onChange={(event) => {
                                        const newStatus = event.target.value as Reading['status']
                                        //Actualiza solo el estado elegido.
                                        setEditStatus(newStatus)

                                        //Oculta la confirmación si cambia de opción.
                                        setShowPendingConfirmation(false)

                                    }}
                                >
                                    <option value="pending">Pendiente</option>
                                    <option value="read">Leída</option>
                                </select>
                            </label>

                            {/*Datos editables exclusivos de una lectura terminada.*/}
                            {editStatus === 'read' && (
                                <div className={styles.modalReadFields}>
                                    <label className={styles.modalField}>
                                        Mes de lectura

                                        <input
                                            type="month"
                                            value={editReadMonth}
                                            onChange={(event) => setEditReadMonth(event.target.value)}
                                        />
                                    </label>

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
                                                aria-checked={editRating === starValue}
                                                aria-label={`${starValue} ${starValue === 1 ? 'estrella' : 'estrellas'}`}
                                                key={starValue}
                                                onClick={() => setEditRating(starValue)}
                                            >
                                                <Star
                                                    aria-hidden="true"
                                                    className={
                                                        starValue <= editRating
                                                            ? styles.ratingStarSelected
                                                            : undefined
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <label className={styles.modalField}>
                                        Reseña

                                        <textarea
                                            value={editReview}
                                            onChange={(event) => setEditReview(event.target.value)}
                                            placeholder="Escribe tu reseña."
                                        />
                                    </label>
                                </div>
                            )}

                            {/*Mensaje de error al editar la lectura.*/}
                            {editErrorMessage && (
                                <p className={styles.modalErrorMessage}>
                                    {editErrorMessage}
                                </p>
                            )}

                            {/*Si se van a perder datos de lectura, pide confirmación, si no botón de guardado.*/}
                            {showPendingConfirmation ? (
                                <div className={styles.Confirmation}>
                                    <p>
                                        Al volver a pendiente la lectura, se eliminarán los datos
                                        asociados (mes, valoración y reseña). ¿Quieres continuar?

                                    </p>

                                    <div className={styles.pendingConfirmationActions}>
                                        <button
                                            className={styles.modalCloseButton}
                                            type="button"
                                            onClick={() => {
                                                //Cancela el cambio de estado y vuelve al valor original.
                                                setEditStatus(selectedReading.status)
                                                setShowPendingConfirmation(false)
                                            }}
                                        >
                                            Cancelar
                                        </button>

                                        <button 
                                            className={styles.modalSaveButton}
                                            type="button"
                                            onClick={handleUpdateReading}
                                        >
                                            Confirmar cambio
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.modalActions}>
                                    <button
                                        className={styles.modalSaveButton}
                                        type="button"
                                        onClick={handleUpdateReading}
                                    >
                                        Guardar cambios
                                    </button>

                                    {/*Cieela el modal completo sin guardar nada.*/}
                                    <button
                                        className={styles.modalCloseButton}
                                        type="button"
                                        onClick={closeEditModal}
                                    >
                                        Cancelar edición
                                    </button>
                                </div>
                            )} 
                        </section>
                    </div>
                )}

                {/*Confirmación previa a la eliminación definintiva.*/}
                {readingToDelete && (
                    <div className={styles.modalBackdrop}>
                        <section
                            className={styles.modalCard}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-reading-title"
                        >
                            <h2 id="delete-reading-title">
                                Eliminar lectura
                            </h2>
                            <p>
                                ¿Seguro que quieres eliminar 
                                {' '}
                                <strong>
                                    {readingToDelete.title}
                                </strong>
                                {' '}
                                de tu biblioteca?
                            </p>

                            {/*Solo para las lecturas leídas.*/}
                            {readingToDelete.status === 'read' && (
                                <p>
                                    Esta acción eliminará también su estado, fecha,
                                    valoración y reseña.
                                </p>
                            )}

                            {/*Mensaje si falla.*/}
                            {deleteErrorMessage && (
                                <p className={styles.modalErrorMessage}>
                                    {deleteErrorMessage}
                                </p>
                            )}

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.modalCloseButton}
                                    type="button"
                                    onClick={closeDeleteConfirmation}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className={styles.modalDeleteButton}
                                    type="button"
                                    onClick={handleDeleteReading}
                                >
                                    Eliminar definitivamente
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    )
}

export default ReadingListPage
