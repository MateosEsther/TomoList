//Servicio para llamar a la API de GoogleBooks.

//Datos simplificados de la respuesta de la API GoogleBooksque interesan para la app.
export type GoogleBookResult = {
    title: string
    author: string
    coverUrl: string | null
    synopsis: string | null
}

//Consulta a la API GoogleBooks para que devuelva los resultados anteriores.
export async function searchGoogleBooks(query: string): Promise<GoogleBookResult[]> {
    //Lee la clave de GoogleBooks del archivo .env.
    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

    if (!apiKey) {
        throw new Error('Falta la API key de Google Books')
    }

    //En búsquedas vacias, no gasta recursos de petición.
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
        return []
    }

    //Construye la petición URL para la API.
    const url = new URL('https://www.googleapis.com/books/v1/volumes')
    url.searchParams.set('q', trimmedQuery) //Qué buscar
    url.searchParams.set('key', apiKey) //API key
    url.searchParams.set('maxResults', '5') //Limita el resultado.
    url.searchParams.set('langRestrict', 'es') //Restringe al resultado en español.

    //Pide los datos, si hay error, lanza error.
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('No se ha podido consultar Google Books')
    }

    //Convierte la respuesta .json a un objeto JS .json().
    const data = await response.json()

    //Convierte la respuesta en un array de objetos,
    //si no hay items, devuelve un array vacío.
    const items = (data.items ?? []) as Array<{
        volumeInfo?: {
            title?: string
            authors?: string []
            description?: string
            imageLinks?: {
                thumbnail?: string
            }
        }
    }>

    //Convierte el array de objetos a un array de objetos GoogleBookResult que tiene el
    //formato de TomoList. Descarta los que no tienen título.
    return items
        //Por cada libro de GoogleBooks, hace un objeto GoogleBookResult.
        .map((item) => {
            const volumeInfo = item.volumeInfo
            //Sin título, devuelve null para descartarlo.
            if (!volumeInfo?.title) {
                return null
            }

            return {
                title: volumeInfo.title,
                //Array -> join para unir los autores.
                //Si no hay autores, devuelve 'Autor desconocido'.
                author: volumeInfo.authors?.join(', ') ?? 'Autor desconocido',
                coverUrl: volumeInfo.imageLinks?.thumbnail ?? null,
                synopsis: volumeInfo.description ?? null,
            }
        })
        //Filtra los nulls.
        .filter((item): item is GoogleBookResult => item !== null)
}