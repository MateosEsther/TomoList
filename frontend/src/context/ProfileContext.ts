import { createContext } from 'react';
import type {
    Dispatch,
    SetStateAction,
} from 'react'

//Define el perfil. Va con null porque Supabase puede devolver campos vacíos.
export type Profile = {
    name: string | null
    surname: string | null
    display_name: string | null
    avatar_id: string | null
}

//Define el contenido que el contexto entrega a los componentes.
export type ProfileContextValue = {
    //Perfil actual
    profile: Profile | null

    //Id user autenticado.
    userId: string | null

    //Email, viene de Supabase.
    email: string

    //Indica que el perfil está cargado o no.
    isLoadingProfile: boolean

    //Para modificar el perfil desde otro componente.
    setProfile: Dispatch<SetStateAction<Profile | null>>

    //Recarga el perfil desde Supabase.
    refreshProfile: () => Promise<void>
}

//Crea el contexto.
export const ProfileContext = createContext<ProfileContextValue | null>(null)