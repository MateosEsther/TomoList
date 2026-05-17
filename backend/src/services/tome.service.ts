import type { CreateTomeDto } from '../types/tome.types.js';

import {
    createTome,
    findAllTomes,
    findTomeById
} from '../repositories/tome.repository.js';

//Función que obtiene todas las lecturas. Pide los datos al repository, no guarda datos.
export function getAllTomes() {
    const tomes = findAllTomes()

    return tomes
}

//Función que obtiene una lectura por su id.
export function getTomeById(id: number) {
    const tome = findTomeById(id)

    return tome
}

//Función que crea una nueva lectura
export function createNewTome(data: CreateTomeDto) {
    //Si se crea como leída
    if (data.status === 'read' && data.rating === undefined) {
        throw new Error('La valoración es obligatoria en estado leída.')
    }

    //Si se crea como pendiente
    if (data.status === 'pending') {
        const pendingTomeData: CreateTomeDto = {
            title: data.title,
            author: data.author,
            type: data.type,
            status: data.status,
        }

        return createTome(pendingTomeData)
    }

    return createTome(data)
}