//Importa .js en lugar de .ts porque TS compila el ts a js que es lo que espera Node
import app from './app.js'

const PORT = 3000

app.listen(PORT, () => {
    console.log(`TomoList backend running on http://localhost:${PORT}`)
})