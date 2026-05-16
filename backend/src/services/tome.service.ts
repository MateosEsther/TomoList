import { 
    findAllTomes,
    findTomeById
} from "../repositories/tome.repository";

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