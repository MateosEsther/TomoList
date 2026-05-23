//Crentraliza la conexión con Supabase, se podrá usar cuando haga falta en cualquier punto del frontend.

import { createClient } from '@supabase/supabase-js'

//URL pública, se lee desde frontend/.env con Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

//Clave pública
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

//Comprobación por si falta alguna variable
if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error ('Faltan variables de entorno de Supabase.')
}

//Cliente principal de Supabase, desde aquí se hacen registros, incios de sesión y consultas.
export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey
)
