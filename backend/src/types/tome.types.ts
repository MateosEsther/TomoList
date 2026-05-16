//Tipo provisional que representa una lectura guardada en TomoList.
//De momento se usa para tipar los datos temporales del backend.
//Más adelante deberá alinearse con el modelo real de base de datos.
export type Tome = {
    id: number
    title: string
    author: string
    type: 'manga' | 'literature'
    status: 'pending' | 'read'
    coverUrl?: string
    synopsis?: string
    readMonth?: string
    rating?: number
    review?: string
}