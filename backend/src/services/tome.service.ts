import { findAllTomes } from "../repositories/tome.repository";

//Función que obtiene todas las lecturas. Pide los datos al repository.
export function getAllTomes() {
    const tomes = findAllTomes()

    return tomes
}