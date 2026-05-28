//Extensión usada por los avatares guardados en public/avatars.
const AVATAR_EXTRENSION = 'webp'

//Devuelve la ruta pública del avatar a partir del avatar_id.
export function getAvatarUrl(avatarId: string) {
    return `/avatars/${avatarId}.${AVATAR_EXTRENSION}`
}