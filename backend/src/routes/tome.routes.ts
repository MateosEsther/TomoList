import { Router } from 'express'

import { getTomes } from '../controllers/tome.controller.js'

//Router específico del módulo Tome. Agrupa las rutas relacionadas con las lecturas guardadas.
const tomeRouter = Router()

// GET /api/tomes
tomeRouter.get('/', getTomes)

export default tomeRouter