//Corrección visual ortográfica del título y autora/o
export function formatTittle(title: string) {
    const cleanTitle = title.trim()
        
        return cleanTitle.replace(
            /\p{L}/u,
            (firstLetter) => firstLetter.toUpperCase()
        )
}

export function formatAuthor(author: string) {
    const cleanAuthor = author.trim()

        return cleanAuthor.replace(
            /(^|[\s'-])\p{L}/gu,
            (firstLetter) => firstLetter.toUpperCase()
        )
}