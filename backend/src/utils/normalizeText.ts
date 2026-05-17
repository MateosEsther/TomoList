//Normalización de textos para comparaciones internas, evita duplicados, mayúsculas/minúsculas, espacios de más...
export function normalizeText(value: string) {
    return value.trim().toLowerCase()
}