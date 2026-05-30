import { 
    useCallback,
    useEffect,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ProfileContext } from './ProfileContext';
import type { Profile } from './ProfileContext';

//Definiendo las props del Provider.
type ProfileProviderProps = {
    children: ReactNode
}

//Datos autenticados que recoge el Provider desde Supabase.
//Perfil de public.profiles y email e id de Supabase Auth.
type AuthenticatedProfileData = {
    profile: Profile | null
    userId: string | null
    email: string
}

//Consulta user autenticado y su perfil en Supabase.
async function fetchAuthenticatedProfile(): Promise<AuthenticatedProfileData> {
    //Trae user utenticado desde Supabase Auth.
    const { data: userData, error: userError } = await supabase.auth.getUser()

    //Si no hay user o Supabase devuelve error:
    if (userError || !userData.user) {
        return {
            profile: null,
            userId: null,
            email: ''
        }
    }

    //Busca el perfil asociado al user autenticado.
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, surname, display_name, avatar_id')
        .eq('id', userData.user.id)
        .single()

    //Si falla la consulta, conserva los datos del Auth pero devuelve el perfill como null.
    if (profileError) {
        return {
            profile: null,
            userId: userData.user.id,
            email: userData.user.email ?? '',
        }
    }
    
    //Devuelve datos del perfil + de Auth.
    return {
        profile: profileData,
        userId: userData.user.id,
        email: userData.user.email ?? '',
    }
}


//Componente que cargará el perfil y lo compartirá con sus hijos.
export function ProfileProvider({ children }: ProfileProviderProps) {
    //Guarda el perfil del user autenticado.
    const [profile, setProfile] = useState<Profile | null>(null)
    //Guarda el id del user autenticado.
    const [userId, setUserId] = useState<string | null>(null)
    //Guarda el email del user auntenticado.
    const [email, setEmail] = useState('')

    //EMpieza en true porque el usuario estará autenticado pero todavía no ha cargado los datos desde la tabla profiles.
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)

    //Recarga el perfil autenticado desde Supabase. useCallback manteine estable la función que guarda
    //dentro de useEffect sin crear una nueva función con cada renderizado.
    const refreshProfile = useCallback(async () => {

        //Indica una nueva carga del perfil.
        setIsLoadingProfile(true)

        //Reutiliza la función para consultar perfil, email e id.
        const authenticatedProfileData = await fetchAuthenticatedProfile()

        //Actualiza los estados compartidos.
        setProfile(authenticatedProfileData.profile)
        setUserId(authenticatedProfileData.userId)
        setEmail(authenticatedProfileData.email)

        //Indica que la carga ha terminado.
        setIsLoadingProfile(false)
    }, [])

    //Al montar el Provider, carga el perfil inicial.
    //Escucha también los cambios de autenticación para el cierre o inicio de sesión.
    useEffect(() => {
        //Evita actualizaciones si el Provider se desmonta antes de terminar la consulta inicial.
        let isMounted = true
        
        //Guarda el temporizador usado para recargar el perfil después de un evento de autenticación.
        let authRefreshTimeout: ReturnType<typeof setTimeout> | undefined

        //Carga inicial del perfil: 1º respuesta de Supabase, 2º actualiza estados.
        async function loadIntialProfile() {
            const authenticatedProfileData = await fetchAuthenticatedProfile()

            //Si el Provider ya no está montado, no actualiza.
            if (!isMounted) {
                return
            }
            //Guarda los datos tras la carga inicial.
            setProfile(authenticatedProfileData.profile)
            setUserId(authenticatedProfileData.userId)
            setEmail(authenticatedProfileData.email)
            setIsLoadingProfile(false)
        }

        void loadIntialProfile()

        //Escucha cambios de autenticación desde Supabase.
        const { data: authListener } = supabase.auth.onAuthStateChange((event) =>{
            //Si cierra sesión, limpia perfil.
            if (event === 'SIGNED_OUT') {
                setProfile(null)
                setUserId(null)
                setEmail('')
                setIsLoadingProfile(false)
                return
            }

            //Si user inicia sesión o actualiza datos del Auth, recarga el perfil.
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                authRefreshTimeout = setTimeout(() => {
                    void refreshProfile()
                }, 0)
            }
        })

    //Al desmontar el Provider, evita actualizaciones, cancela cargas pednientes y elimina cambios de Auth.
    return () => {
        isMounted = false
        if(authRefreshTimeout) {
            clearTimeout(authRefreshTimeout)
        }

        authListener.subscription.unsubscribe()
    }
},[refreshProfile])

    //Comparte el perfil, estado de carga y funciones con todos los componentes dentro del provider.
    return (
        <ProfileContext.Provider
            value={{
                profile,
                userId,
                email,
                isLoadingProfile,
                setProfile,
                refreshProfile
            }}
        >
            {children}
        </ProfileContext.Provider>
    )
}
