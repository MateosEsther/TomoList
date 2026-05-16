import express, { Request, Response } from 'express'

const app = express()
const PORT = 3000

//Para que Express pueda leer el JSON enviado en las peticiones.
app.use(express.json())

//Ruta de prueba para comprobar que el backend está funcionando.
app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        service: 'tomolist-backend',
    })
})

app.listen(PORT, () => {
    console.log(`TomoList backend running on http://localhost:${PORT}`)
})