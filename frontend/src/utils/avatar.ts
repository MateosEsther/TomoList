//Extensión usada por los avatares guardados en public/avatars.
const AVATAR_EXTENSION = 'webp'

//Lista de avatares disponibles elegibles.
export const AVATAR_IDS = [
    'avatar-01',
    'avatar-02',
    'avatar-03',
    'avatar-04',
    'avatar-05',
    'avatar-06',
    'avatar-07',
    'avatar-08',
    'avatar-09',
    'avatar-10',
    'avatar-11',
    'avatar-12',
    'avatar-13',
    'avatar-14',
    'avatar-15',
    'avatar-16',
    'avatar-17',
    'avatar-18',
] as const

//Tipo que represnta un avatar válido para TypeScript.
export type AvatarId = typeof AVATAR_IDS[number]

//Devuelve la ruta pública de un avatar a parti del avatar_id.
export function getAvatarUrl(avatarId: AvatarId | string) {
    return `/avatars/${avatarId}.${AVATAR_EXTENSION}`
}