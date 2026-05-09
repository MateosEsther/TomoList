import styles from './PrimaryButton.module.scss'

// Define qué puede recibir el componente. 
// Children = "'esto' va dentro del botón".
// type? para los tipos que puede recibir.
type PrimaryButtonProps = {
    children: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
}

function PrimaryButton({ children, type = 'button' }: PrimaryButtonProps) {
    return(
        <button className={styles.primaryButton} type={type}>
            {children}
        </button>
    )
}

export default PrimaryButton