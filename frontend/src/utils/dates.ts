//Formatea la fecha de la última lectura para que se vea en la vista.
export function formatLastUpdated(isoDate: string | null): string {
    //Si no hay fecha, muestra mensaje.
    if (!isoDate) {
        return 'Sin lecturas todavía'
    }
    //Si hay fecha, la formatea en formato español (dd/mm/yyyy).
    return new Date(isoDate).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

//Formatea la fecha de lectura al formato español (mm/yyyy).
export function formatReadMonth(yearMonth: string | null): string {
    //Si no hay fecha, no devuelve nada.
    if (!yearMonth) {
        return ''
    }

    //Si hay fecha, cambia el formato.
    const [year, month] = yearMonth.split('-')

    const date = new Date(Number(year), Number(month) - 1, 1)

    return date.toLocaleDateString('es-ES', {
        //Formato de mes corto para pantallas pequeñas.
        month: 'short',
        year: 'numeric',
    })
}