import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

//Hook para acceder al contexto creado del perfil.
export function useProfile() {
    const context = useContext(ProfileContext)

    //Si el hook se usa fuera de ProfilProvider, lanza error.
    if (!context) {
        throw new Error('useProfile debe usarse dentro de ProfileProvider')
    }

    return context
}