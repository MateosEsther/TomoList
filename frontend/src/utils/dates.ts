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