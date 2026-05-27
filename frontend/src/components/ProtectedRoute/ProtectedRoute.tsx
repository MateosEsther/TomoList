//useEffect comprobar sesión cuando el componente se carga.
//useState guardar el estado de la comprobación.
import { useEffect, useState } from 'react'

//ReactNode es cualquier contenido React que este componente puede envolver.
import type { ReactNode } from 'react'

//Redirección de rutas.
import { Navigate } from 'react-router'

//Cliente de Supabase que comprobará la autenticación del user.
import { supabase } from '../../lib/supabaseClient'

//Posibles estados de la autenticación
type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

//Props del componente.
type ProtectedRouteProps = {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    //Primero checking
    const [authStatus, setAuthStatus] = useState<AuthStatus>('checking')

    useEffect(() => {
        //Controla que no se actualice estado si el componente se desmonta antes que Supabase responda.
        let isMounted = true

        async function checkUser() {
            //Consulta a Supabase si hay usuario autenticado.
            const { data, error } = await supabase.auth.getUser()

            //Si ya no está montado, no actualiza estado.
            if (!isMounted) {
                return
            }

            //Si hay error o no hay user, la ruta no se muestra.
            if (error || !data.user) {
                setAuthStatus('unauthenticated')
                return
            }
            //Si hay usuario, muestra la vista privada.
            setAuthStatus('authenticated')            
        }

        checkUser()

        //Limpia el efecto.
        return () => {
            isMounted = false
        }

    }, [])

    //No muestra contenido privado durante la comprobación de sesión.
    if (authStatus === 'checking') {
        return <p>Cargando...</p>
    }

    //Si no hay sesión, redirige a la pantalla pública.
    if (authStatus === 'unauthenticated') {
        return <Navigate to="/" replace />
    }

    //Si hay sesión, redirige a la pantalla privada.
    return <>{children}</>
}

export default ProtectedRoute