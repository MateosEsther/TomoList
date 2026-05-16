//Provisional, mientras no hay BD, para representar las lecturas guardadas en TomoList,
//con BD, su función será comunicarse con ésta mediante prisma solicitando la petición del service.
import type { Tome } from '../types/tome.types.js'
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

//Función para buscar lectura por id.
export function findTomeById(id: number) {
    return sampleTomes.find((tome) => tome.id === id)
}