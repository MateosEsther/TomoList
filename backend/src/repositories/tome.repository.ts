//Provisional, mientras no hay BD, para representar las lecturas guardadas en TomoList,
//con BD, su función será comunicarse con ésta mediante prisma solicitando la petición del service.
type Tome ={
    id:number
    title: string
    author: string
    type: 'manga' | 'literature'
    status: 'pending' | 'read'
    converUrl?: string
    synopsis?: string
    readMonth?: string
    rating?: number
    review?: string
}

//Datos para simular y comprobar mientras se va construyendo la web.
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

//Función para obtener las lecturas.
export function findAllTomes() {
    return sampleTomes
}