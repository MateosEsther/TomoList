//Servicio para llamar a la API de AniList.

//Datos que interesan de la respuesta de la API.
export type AniListResult = {
    title: string
    author: string
    coverUrl: string | null
    synopsis: string | null
}

//Query de la consulta GraphQL con los campos que pide la API.
//query ($search: String): consulta con variable
//Page(page: 1, perPage: 5): limita el númeor de resultados a 5
//media(search: $search, type: MANGA): busca solo mangas con esa palabra
//title { romaji english native }: título en varios idiomas
//description: sinopsis (a veces con HTML)
//coverImage { large medium }: tamaño de la portada
//staff { ... }: autor y rol
const ANILIST_SEARCH_QUERY = `
    query ($search: String) {
        Page(page: 1, perPage: 5) {
            media(search: $search, type: MANGA) {
                title {
                    romaji
                    english
                    native
                }
                description
                coverImage { 
                    large
                    medium
                }
                staff(perPage: 8) {
                    edges {
                        role
                        node { 
                            name {
                                full
                            }
                        }
                    }
                }
            }
        }
    }
`

//Consulta a la API para que devuelva los datos de la consulta anterior.
export async function searchAniList(query: string): Promise<AniListResult[]> {
    //Para no gastar recursos en peticiones vacías.
    const trimmedQuery = query.trim()
    if(!trimmedQuery) {
        return []
    }

    //Construye la petición POST para la API.
    const response = await fetch('https://graphql.anilist.co', {
        //Método de la petición (AniList solo acepta POST).
        method: 'POST',
        //Formato de datos.
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        //Consulta y término de la búsqueda.
        body: JSON.stringify({
            //Query para  buscar.
            query: ANILIST_SEARCH_QUERY,
            //Variables dadas por lo que escribe el user.
            variables: {
                search: trimmedQuery
            },
        }),
    })

    if(!response.ok) {
        throw new Error('No se ha podido consultar AniList')
    }

    const data = await response.json()

    //Si GraphQL devuelve errores en el JSON, para.
    if (data.errors) {
        throw new Error('No se ha podido consultar AniList')
    }

    //Si no hay errores, obtiene un array de objetos con los datos de los mangas.
    const media = (data.data?.Page?.media ?? []) as Array<{
        title?: {
            romaji?: string | null
            english?: string | null
            native?: string | null
        }
        description?: string | null
        coverImage?: {
            large?: string | null
            medium?: string | null
        }
        staff?: {
            edges?: Array<{
                role?: string | null
                node?: {
                    name?: {
                        full?: string | null
                    }
                }
            }>
        }
    }>

    return media
        .map((item) => {
            const title =
                item.title?.english
                || item.title?.romaji
                || item.title?.native
            
            if(!title) {
                return null
            }
        
            const staffEdges = item.staff?.edges ?? []
            const storyArtEdges = staffEdges.filter((edge) => {
                const role = edge.role ?? ''
                return role.includes('Story') || role.includes('Art')
            })
            const edgesForAuthor = storyArtEdges.length > 0 ? storyArtEdges : staffEdges
            const authorNames = edgesForAuthor
                .map((edge) => edge.node?.name?.full)
                .filter((name): name is string => Boolean(name))
            
            const uniqueAuthors = [...new Set(authorNames)]

            const rawCover = item.coverImage?.large ?? item.coverImage?.medium ?? null
            const coverUrl = rawCover?.replace(/^http:\/\//i, 'https://') ?? null

            return {
                title,
                author: uniqueAuthors.join(', ') || 'Mangaka desconocid@',
                coverUrl,
                synopsis: item.description ?? null,
            }
        })
        .filter((item): item is AniListResult => item !== null)   
}

