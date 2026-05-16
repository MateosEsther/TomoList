import { Request, Response } from 'express'

import { getAllTomes } from '../services/tome.service.js'

//Responde a la petición HTTP para obtener lecturas. No contiene los datos directamente: pide la información al service.
export function getTomes(_req: Request, res: Response) {
    //Llama al service para obtener las lecturas.
    const tomes = getAllTomes()

    //Responde al cliente con estado 200 y los datos en formato JSON.
    res.status(200).json({
        data: tomes,
    })
}