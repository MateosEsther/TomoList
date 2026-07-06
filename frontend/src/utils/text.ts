//Corrección visual ortográfica del título y autora/o
export function formatTitle(title: string) {
    const cleanTitle = title.trim().toLocaleLowerCase()
        
        return cleanTitle.replace(
            /\p{L}/u,
            (firstLetter) => firstLetter.toUpperCase()
        )
}

export function formatAuthor(author: string) {
    const cleanAuthor = author.trim().toLocaleLowerCase()
    
        return cleanAuthor.replace(
            /(^|[\s'-])\p{L}/gu,
            (firstLetter) => firstLetter.toUpperCase()
        )
}

//Limpia el HTML de un texto.
export function stripHTML(text: string) {
    return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}