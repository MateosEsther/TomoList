import { z } from 'zod'

//Convierte strings vacíos en undefined para que los campos opcionales pueda llegar vacíos desde un form.
function emptyStringToUndefined(value: unknown) {
    if (typeof value === 'string' && value.trim() === '') {
        return undefined
    }
    return value
}

//Schema de validación para crear un Tome, comprueba los datos enviados por el cliente.
export const createTomeSchema = z.object({
    //Título debe ser texto pero puede contener números pero no puede ser un number o estar vacío.
    title: z.string().trim().min(1, 'El título es obligatorio.'),

    //Autor debe ser texto y no puede estar vacío.
    author: z.string().trim().min(1, 'El autor es obligatorio.'),

    //Tipo y estado solo pueden tener valores propios de TomoList.
    type: z.enum(['manga', 'literature'], {
        error: 'El tipo de lectura debe ser manga o literatura.'
    }),
    status: z.enum(['pending', 'read'], {
        error: 'El estado de lectura debe ser pendiente o leída.'
    }),

    //readMonth es opcional: vacío = undefined, completo = formato interno YYYY-MM.
    readMonth: z.preprocess(
        emptyStringToUndefined,
        z
            .string()
            .trim()
            .regex(
                /^\d{4}-(0[1-9]|1[0-2])$/,
                'El mes de lectura debe tener formato YYYY-MM.'
            )
            .optional()
    ),

    //Valoraación es opcional a nivel de campo, pero obligatoria si estatus=read.
    rating: z
        .number()
        .int('La valoración debe ser un número entero.')
        .min(1, 'La valoración mínima es 1.')
        .max(5, 'La valoración máxima es 5.')
        .optional(),

    //Reseña es opcional.
    review: z.preprocess(
        emptyStringToUndefined,
        z.string().trim().optional()
    ),

}).superRefine((data, ctx) => {
    //Regla de negocio: status = leída, lectura debe tener valoración.
    if (data.status === 'read' && data.rating === undefined) {
        ctx.addIssue({
            code: 'custom',
            path: ['rating'],
            message: 'La valoración es obligatoria en estado leída.'
        })
    }
})