import { Router } from 'express'

import {
    createTome,
    getTomeById,
    getTomes,
} from '../controllers/tome.controller.js'

//Router específico del módulo Tome. Agrupa las rutas relacionadas con las lecturas guardadas.
const tomeRouter = Router()

// GET /api/tomes -> devuelve todas las lecturas.
tomeRouter.get('/', getTomes)

// Post /api/tomes -> crea una nueva lectura.
tomeRouter.post('/', createTome)

// GET /api/tomes/:id -> devuelve una lectura concreta según el id recibido por la URL.
tomeRouter.get('/:id', getTomeById)

export default tomeRouter