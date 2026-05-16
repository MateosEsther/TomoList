import { Router, Request, Response } from 'express'

const healthRouter = Router()

//Ruta de prueba para comprobar que el backend está funcionando.
healthRouter.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        service: 'tomolist-backend',
    })
})

export default healthRouter