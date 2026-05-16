//Pendiente de alinearse con el modelo real de base de datos.
type Tome = {
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

//Datos temporales para probar el endpoint sin base de datos.
const sampleTomes: Tome[] = [
    {
        id: 1,
        title: 'Berserk',
        author: 'Kentaro Miura',
        type: 'manga',
        status: 'pending',
        synopsis: 'Lectura pendiente de manga.',
    },
    {
        id: 2,
        title: 'Monster',
        author: 'Naoki Urasawa',
        type: 'manga',
        status: 'read',
        synopsis: 'Thriller psicológico con una narrativa compleja.',
        readMonth: '2025-04',
        rating: 5,
        review: 'Una lectura intensa, adulta y muy bien construida.',
    },
]

//Función del servicio que devuelve todas las lecturas.
export function getAllTomes() {
    return sampleTomes
}