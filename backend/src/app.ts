import express from 'express'

import healthRouter from './routes/health.routes.js'

const app = express()

//Permite que Express pueda leer JSON enviado en las peticiones.
app.use(express.json())

//Rutas de comprobación del estado del backend.
app.use('/api', healthRouter)

export default app