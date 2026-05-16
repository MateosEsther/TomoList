import { Router } from 'express'

import { 
    getTomeById,
    getTomes,
} from '../controllers/tome.controller.js'

//Router específico del módulo Tome. Agrupa las rutas relacionadas con las lecturas guardadas.
const tomeRouter = Router()

// GET /api/tomes
tomeRouter.get('/', getTomes)

// GET /api/tomes/:id
tomeRouter.get('/:id', getTomeById)

export default tomeRouter