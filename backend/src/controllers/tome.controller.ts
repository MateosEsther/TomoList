import { Request, Response } from 'express'

import {
    getAllTomes,
    getTomeById as getTomeByIdService,
} from '../services/tome.service.js'

//Responde a la petición HTTP para obtener lecturas. No contiene los datos directamente: pide la información al service.
export function getTomes(_req: Request, res: Response) {
    //Llama al service para obtener las lecturas.
    const tomes = getAllTomes()

    //Responde al cliente con estado 200 y los datos en formato JSON.
    res.status(200).json({
        data: tomes,
    })
}

//Responde a la petición HTTP para obtener lectura pode Id.
export function getTomeById(req: Request, res: Response) {
    //Los parámetros de ruta llegan como string. Hay que convertir el id recibido por URL en number para poderlo buscar.
    const tomeId = Number(req.params.id)

    //Pide al service que busque el Tome correspondiente.
    const tome = getTomeByIdService(tomeId)

    //Si no existe => 404
    if (!tome) {
        res.status(404).json({
            message: 'Tome not found',
        })

        return
    }

    //Si existe => 200 e info.
    res.status(200).json({
        data: tome,
    })
}