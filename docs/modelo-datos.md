# Modelo de datos de TomoList

Aquí se recoge el diseño inicial del modelo de datos de TomoList.

La finalidad de este documento es dejar claras las entidades principales, sus campos, las reglas de negocio y los
diagramas necesarios para entender el modelo de datos del proyecto.

TomoList es una app web de gestión personal de lecturas, en la que el usuario puede guardar lecturas de tipo manga o 
literatura, clasificarlas como pendientes o leídas, y registrar información personal como valoración, reseña y 
mes aproximado de lectura.

La aplicación también consulta APIs externas, cuando estén disponibles, con fines de enriquecimiento aportando título, autora/o, sinopsis y portada con la elección del resultado del catálogo por user autenticado.

---

## 1.Entidad principal: Tome

Es la entidad central de la app web y representa las lecturas guardadas por cada ususari@ independientemente del tipo.

Un `Tome` pertenece siempre al usuari@ únic@ y representa una lectura concreta dentro de su biblioteca personal.

## 1.2.Modelo provisional de Tome

```ts
type Tome = {
    id: number
    user_id: number

    title: string
    title_normalized: string

    author: string
    author_normalized: string

    type: 'manga' | 'literature'
    status: 'pending' | 'read'

    coverUrl?: string
    synopsis?: string

    read_month?: string
    rating?: number
    review?: string

    created_at: string
    updated_at: string
}
```

## 1.3.Origen de los datos

### DATOS INTRODUCIDOS POR USER

```txt
type
status
readMonth
rating
review
```
User introduce title y author para buscar en la API o como texto libre si no hay resultados; la API corrige ortografía cuando user elige un resultado del catálogo.
La introducción de los datos principales de la lectura es manual mediante el formulario. 
Si la lectura está marcada como leída, se desplegarán datos adicionales a introducir: `rating` será obligatorio
 y `review` y `readMonth` opcionales.

### DATOS OBTENIDOS DESDE APIs EXTERNAS
```txt
title
author
coverUrl
synopsis
```

Si las APIs no devuelven título y/o autora/o, se guardan con el dato introducido manualmente. Si la portada y la sinopsis, no están en la API,  la lectura se guarda igualmente.

### DATOS GENERADOS POR EL SISTEMA
```txt
id
userId
title_normalized
author_normalized
created_at
updated_at
```

Son identificadores, fechas de creación y actualización, y versiones normalizadas del título y del autor para evitar duplicados.

## 1.4.Reglas de negocio de Tome

### Regla 1: una lectura pertenece a una única usuari@
Cada `Tome` debe pertenecer a una única usuari@. 
Una usuari@ puede tener muchas lecturas guardadas.    

### Regla 2: no se pueden repetir lecturas
Misma usuari@ no puede guardar dos veces la misma lectura.
Restricción lógica:
```txt
user_id + title_normalized + author_normalized + type
```

### Regla 3: una lectura pendiente no tiene valoración, reseña ni mes de lectura
Al no haber sido leída, no debe tener esa información.
Restricción lógica:
```txt
si status = pending,
entonces rating = null, 
review = null
y readMonth = null
```

### Regla 4: una lectura leída exige valoración
Al cambiar estado o registrar la lectura como leída, el único dato obligatorio es `rating`.
Restricción lógica:
```txt
si status = read,
entonces rating != null.
```
`review`y `read_month`son opcionales.


### Regla 5: cambiar una lectura de leída a pendiente elimina los datos del estado `read` de lectura
Eliminará definitivamente los datos:
```txt
rating
review
readMonth
```

Antes de aplicar el cambio se muestra un aviso.

### Regla 6: el mes de lectura es orientativo
Permite dar una referencia aproximada del momento de la lectura. 
El formato será:
```txt
YYYY-MM
```

---

## 2.Diagrama entidad-relación inicial

```mermaid
erDiagram
    PROFILE ||--o{ TOME : owns

        PROFILE {
            uuid id
            string name
            string surname
            string display_name
            string avatar_id
            datetime created_at
            datetime updated_at
        }

        TOME {
            number id
            uuid user_id
            string title
            string title_normalized
            string author
            string author_normalized
            string type
            string status
            string coverUrl
            string synopsis
            string read_month
            number rating
            string review
            datetime created_at
            datetime updated_at
        }
```

Este diagrama representa la relación principal del sistema:

- Un perfil puede tener muchas lecturas guardadas.
- Cada `Tome` pertenece a una única usuari@.
- La autenticación de usuari@ se gestiona mediante Supabase Auth.

---

## 3.Diagrama de estados de Tome

```mermaid
stateDiagram-v2
    [*] --> Pending: Añadir como pendiente
    [*] --> Read: Añadir como leída

    Pending --> Read: Marcar como leída
    Read --> Pending: Marcar como pendiente con aviso

    Read --> Read: Editar valoración, reseña o mes de lectura
    Pending --> Pending: Mantener como pendiente
```

Regla asociada al cambio de `read` a `pending`:

```txt
Si un Tome pasa de read a pending, se eliminan rating, review y readMonth previo aviso.
```

---

## 4.Flujo de añadir Tome

```mermaid
flowchart TD
    A[Usuario entra en Añadir lectura] --> B[Escribe título y autor o busca en catálogo]
    B --> C[Selecciona tipo: manga o literatura]
    C --> D[Selecciona estado]

    D -->|Pendiente| E[No se muestran valoración, reseña ni mes de lectura]
    D -->|Leída| F[Se muestran rating, review y read_month]

    F --> G[Usuario introduce rating obligatorio]
    G --> H[Usuario puede añadir review y read_month]
    H --> I[Consultar APIs externas]

    E --> I

    I --> J{¿Hay resultados en la API?}

    J -->|Sí| K[Mostrar lista de resultados]
    K --> L{¿El usuario elige un resultado?}

    L -->|Sí| M[Usar title, author, coverUrl y synopsis del resultado]
    L -->|No| N[Usar título y autor escritos por el usuario]

    J -->|No| N

    M --> O{¿Ya existe esa lectura para el usuario?}
    N --> O

    O -->|Sí| P[Mostrar error: lectura ya guardada]
    O -->|No| Q[Guardar lectura en Supabase]

    Q --> R[Mostrar lectura en su lista correspondiente]

```
Si user elige un resultado de la API, se guardan título, autor, portada y sinopsis del catálogo. Si no hay resultados, no elige ninguno o prefiere no usar el catálogo, se guardan el título y el autor que escribió (con formatTitle como respaldo). Si faltan portada o sinopsis, la lectura se guarda igualmente con esos campos vacíos.
---

## 5.Flujo de cambio de estado

```mermaid
flowchart TD
    A[Usuario edita un Tome] --> B{Estado actual}

    B -->|Pending| C[Usuario marca como leído]
    C --> D[Se habilita rating obligatorio]
    D --> E[Usuario puede añadir review y read_month]
    E --> F[Guardar cambios]
    F --> G[Tome pasa a lista de leídas]

    B -->|Read| H[Usuario marca como pendiente]
    H --> I[Mostrar aviso de eliminación]
    I --> J{¿Confirma el cambio?}

    J -->|No| K[Se mantiene como leído]
    J -->|Sí| L[Eliminar rating, review y read_month]
    L --> M[Guardar cambios]
    M --> N[Tome pasa a lista de pendientes]
```
---

## 6.Entidad Profile

La entidad `profile` representa los datos de perfil para cada usuari@ registrad@ en TomoList. 
Cada usuari@ puede iniciar y cerrar sesión, gestionar su perfil, elegir un avatar predefinido,
gestionar su biblioteca y consultar información de sus listas.

## 6.1.Modelo de Profile
```ts
type profile = {
    id: string

    name: string
    surname: string
    display_name: string
    avatarId: string

    createdAt: string
    updatedAt: string
}
```
## 6.2.Origen de los datos

### DATOS INTRODUCIDOS POR USER
```txt
name
surname
```
Nombre y apellidos se introducen durante el registro. 
El avatar y el nombre visible (`display_name`) se podrá modificar desde la pantalla "Mi perfil" una vez iniciada sesión.

### DATOS GENERADOS POR EL SISTEMA
```txt
id
display_name
avatar_id
created_at
updated_at
```
El campo `id` se corresponde con `user_id` autenticando en Supabase Auth.
El campo `display_name` inicializa con el valor del campo `name` y se puede editar posteriormente desde el perfil.
EL campo `avatar_id` guarda el identificador del avatar seleccionado en el perfil.

## 6.3.Reglas de negocio de User

### Regla 1: el perfil es único
Cada usuari@ registrado debe tener un perfil asociado.
Relación lógica:
    Supabase Auth user 1 ---- 1 profile

### Regla 2: email y contraseña pertenecen a Supabase Auth
Email, constraseña y user sesion no se guardan en `profiles`.

### Regla 3: cada usuari@ puede tener muchas lecturas
Una usuari@ puede guardar muchas lecturas. 
Relación lógica:
```txt
profile 1 ---- N Tome
```

### Regla 4: avatar guardado en avatar_id
Cada usuari@ podrá elegir un avatar entre los disponibles predefinidos.
La base de datos guardará solo el identificador del avatar seleccionado.

---

## 7.Avatares predefinidos

TomoList usará avatares predefinidos que vivirán en el frontend y sus imágenes estarán una carpeta
pública del proyecto. Estructura orientativa:
```txt
public/
└── avatars/
    ├── avatar-01.png
    ├── avatar-02.png
    ├── avatar-03.png
    ├── avatar-04.png
    ├── ...
    └── avatar-18.png
```
En BD solo se guardará el identificador `avatar_id` y con ello mostrará la imagen correspondiente.

---

## 8.Autenticación y sesión

TomoList usa Supabase Auth para gesrionar la utenticación y la sesión de usuari@s. Este sistema permite:
- registrarse
- iniciar/cerrar sesión
- mantener la sesión activa
- recuperar la contraseña
- cambiar la contraseña desde el perfil


Al iniciar sesión, Supabase Auth mantiene la sesión activa en el navegador y a partir de aquí, la app
sabe si está autenticad@ o no y así consultar los datos asociados.


## 8.1.Modelo provisional de sesión

User autenticado se relaciona con las tablas propias del proyecto mediante su identificador.
En `profiles` el campo es `id` y en en `tomes` es `user_id`, así cada perfil y cada lectura quedan vinculados
al user autenticado correspondiente.


## 8.2.Reglas de negocio de sesión

### Regla 1: cada usuari@ accede solo a sus datos
Cada sesión pertenece a un id único accediendo así solo a su propio perfil y lecturas.

### Regla 2: la sesión identifica al usuari@ autenticad@
La sesión activa permite saber qué usuario está usando la aplicación y qué datos le pertenecen.

### Regla 3: cerrar sesión finaliza el acceso privado
Al cerrar sesión, se pierde el acceso a las rutas privadas de TomoList.

---

## 9.Gestión de contraseñas

En TomoList los datos `email` y `contraseña` viven Supabase Auth en lugar de ser datos de la tabla `profiles`. Hay dos formas de gestionar las contraseñas en TomoList:
- recuperar la contraseña cuando se ha olvidado desde la vista del login.
- cambiar la contraseña actual por una nueva desde Mi perfil una vez iniciada la sesión.

## 9.1.Recuperación de contraseña olvidada.

Rutas: /forgot-password, /reset-password
Páginas: ForgotPasswordPage, ResetPasswordPage
APIs: resetPasswordForEmail, updateUser

```mermaid
flowchart TD
    A[Login: olvidé contraseña] --> B[/forgot-password]
    B --> C[Usuario escribe email]
    C --> D[resetPasswordForEmail]
    D --> E[Email con enlace]
    E --> F[/reset-password]
    F --> G[Contraseña nueva + confirmación]
    G --> H[updateUser]
    H --> I[Login /]
```

Regla de UX: el mensaje tras pedir el email no revela si la cuenta existe o no (seguridad).

## 9.2.Cambio de contraseña desde el perfil.

Se realiza con sesión activa desde la vista mi perfil.
Rutas: /perfil
Páginas: ProfilePage, componente ChangePasswordForm
APIs: updateUser

```mermaid
flowchart TD
    A[Usuario en /perfil con sesión] --> B[Clic en Cambiar contraseña]
    B --> C[Contraseña nueva + confirmación]
    C --> D[Validación: campos y coincidencia]
    D --> E[updateUser]
    E --> F[Cierra formulario + mensaje de éxito]
    C --> G[Cancelar]
    G --> B
```

Regla de UX: tras guardar bien, el form se cierra y el mensaje de éxito desaparece a los 3 segundos.

---

## 10.APIs externas de enriquecimiento

TomoList consulta una API distinta según el `type` de la lectura. El usuario escribe título y autor (o solo título) para buscar en el catálogo; si elige un resultado, se guardan los datos que devuelve la API. Si no hay resultados o prefiere no elegir ninguno, se guarda lo que escribió manualmente.

### 10.1.API por tipo de lectura

| type | API | Protocolo |
|------|-----|-----------|
| `literature` | Google Books | REST |
| `manga` | AniList | GraphQL |

### 10.2.Google Books (literatura)

- **Documentación:** https://developers.google.com/books
- **Búsqueda:** `GET https://www.googleapis.com/books/v1/volumes?q={consulta}&key={API_KEY}`
- **API key:** obligatoria. Se guarda en `.env` como `VITE_GOOGLE_BOOKS_API_KEY` y no se sube al repositorio.
- **Campos que se mapean a `Tome`:**
```txt
title       ← volumeInfo.title
author      ← volumeInfo.authors (unidos si hay varios)
coverUrl    ← volumeInfo.imageLinks.thumbnail (si existe)
synopsis    ← volumeInfo.description (si existe)
```

### 10.3.AniList (manga)
- **Documentación:** https://anilist.gitbook.io/anilist-apidaniel/
- **Endpoint:** POST https://graphql.anilist.co
- **API key:** no requiere clave, se identifica la app en el header si AniList lo pide.
- **Campos que se mapean a `Tome`:**
```txt
title       ← Media.title o title.romaji / title.english (priorizar español/inglés si existe)
author      ← staff edges con rol Story & Art o autor principal
coverUrl    ← coverImage.large o coverImage.medium
synopsis    ← description (puede venir en HTML; limpiar al guardar)
```

### 10.4.Reglas de uso

1.La consulta a la API se hace desde `AddTomePage` antes de guardar en Supabase.
2.Si la API no devuelve `title` o `author`, se usan los introducidos manualmente.
3.Si faltan `portada` o `sinopsis`, la lectura se guarda con esos campos en null.
4.No se persiste la respuesta cruda de la API en la base de datos; solo los campos de `Tome`.
5.El usuario puede guardar sin elegir resultado del catálogo (fallback manual con `formatTitle`).
