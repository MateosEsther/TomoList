import styles from './AuthInput.module.scss'

//Define los datos que puede recibir el componente. id y label son obligatorios, los que tienen ? son opcionales,
//pero en caso de usarse, solo pueden tener los valores asociados.
type AuthInputProps = {
    id: string
    label: string
    type?: 'text' | 'email' | 'password'
    placeholder?: string
    size?: 'default' | 'compact'
}

function AuthInput({
    id,
    label,
    type = 'text', //le da un valor por defecto
    placeholder,
    size = 'default', //le da un valor por defecto
}: AuthInputProps) {
    //Elige qué clase aplica según el tamaño del input
    const fieldClassName =
        size === 'compact'
            ? `${styles.field} ${styles.compact}`
            : styles.field

    return (
        <div className={fieldClassName}>
            <label htmlFor={id}>{label}</label>

            <input
                id={id}
                type={type}
                placeholder={placeholder}
            />
        </div>
    )
}

export default AuthInput