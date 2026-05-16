import express from 'express'

import healthRouter from './routes/health.routes.js'
import tomeRouter from './routes/tome.routes.js'

const app = express()

//Permite que Express pueda leer JSON enviado en las peticiones.
app.use(express.json())

//Rutas de comprobación del estado del backend.
app.use('/api', healthRouter)

//Rutas de Tome.
app.use('/api/tomes', tomeRouter)

export default app