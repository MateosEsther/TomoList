import { Request, Response } from 'express'

import {
    createNewTome,
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

//Responde a la petición HTTP para crear una nueva lectura.
export function createTome(req: Request, res: Response) {
    try {
        //La petición contiene los datos enviados por el cliente desde req.body y llama al service createNewTome.
        const newTome = createNewTome(req.body)

        //Si va bien, responde 201 y se crea un nuevo recurso.
        res.status(201).json({
            data: newTome
        })
    } catch (error) {
        //Si el service detecta que hay un error de regla de negocio, responde error 400 por datos inválidos.
        res.status(400).json({
            message: error instanceof Error ? error.message: 'Los datos enviados no son válidos.',
        })
    }
}