# Modelo de datos de TomoList

Aquí se recoge el diseño inicial del modelo de datos de TomoList.

La finalidad de este documento es dejar claras las entidades principales, sus campos, las reglas de negocio y los
diagramas necesarios antes de comenzar el desarrollo del backend.

TomoList es una app web de gestión personal de lecturas, en la que el usuario puede guardar lecturas de tipo manga o 
literatura, clasificarlas como pendientes o leídas, y registrar información personal como valoración, reseña y 
mes aproximado de lectura.

La aplicación también podrá consultar APIs externas, cuando estén disponibles, con fines de enriquecimiento 
aportando la sinopsis y la portada.

---

## 1.Entidad principal: Tome

Es la entidad central de la app web y representa las lecturas guardadas por el usuario independientemente del tipo.

Un `Tome` pertenece siempre a un usuario y representa una lectura concreta dentro de su biblioteca personal.

## 1.2.Modelo provisional de Tome

```ts
type Tome = {
    id: number
    userId: number

    title: string
    titleNormalized: string

    author: string
    authorNormalized: string

    type: 'manga' | 'literature'
    status: 'pending' | 'read'

    coverUrl?: string
    synopsis?: string

    readMonth?: string
    rating?: number
    review?: string

    createdAt: string
    updatedAt: string
}
```

## 1.3.Origen de los datos

### DATOS INTRODUCIDOS POR EL USUARIO

```txt
title
author
type
status
readMonth
rating
review
```

El usuario introduce manualmente los datos principales de la lectura. 
Si la lectura está marcada como leída, se desplegarán datos adicionales a introducir: `rating` será obligatorio
 y `review` y `readMonth` opcionales.

### DATOS OBTENIDOS DESDE APIs EXTERNAS
```txt
coverUrl
synopsis
```

Si las APIs no devuelven portada o sinopsis, la lectura debe poder guardarse igualmente.

### DATOS GENERADOS POR EL SISTEMA
```txt
id
userId
titleNormalized
authorNormalized
createdAt
updatedAt
```

Son identificadores, fechas de creación y actualización, y versiones normalizadas del título y del autor para evitar duplicados.

## 1.4.Reglas de negocio de Tome

### Regla 1: una lectura pertenece a un usuario
Cada `Tome` debe pertenecer a un único usuario. 
Un usuario puede tener muchas lecturas guardadas.    

### Regla 2: no se pueden repetir lecturas
Un mismo usuario no puede guardar dos veces la misma lectura.
Restricción lógica:
```txt
userId + titleNormalized + authorNormalized + type
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
`review`y `readMonth`son opcionales.


### Regla 5: cambiar una lectura de leída a pendiente elimina los datos del estado `read` de lectura
Eliminará definitivamente los datos:
```txt
rating
review
readMonth
```

Antes de aplicar el cambio se mostrará un aviso al usuario.

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
    USER ||--o{ TOME : owns

    USER {
        number id
        string name
        string email
        string passwordHash
        string avatarId
        datetime createdAt
        datetime updatedAt
    }

    TOME {
        number id
        number userId
        string title
        string titleNormalized
        string author
        string authorNormalized
        string type
        string status
        string coverUrl
        string synopsis
        string readMonth
        number rating
        string review
        datetime createdAt
        datetime updatedAt
    }
```

Este diagrama representa la relación principal del sistema:

- Un usuario puede tener muchas lecturas guardadas.
- Cada `Tome` pertenece a un único usuario.

---

## 3.Diagrama de estados de Tome

```mermaid
stateDiagram-v2
    [*] --> Pending: Añadir como pendiente
    [*] --> Read: Añadir como leída

    Pending --> Read: Marcar como leída
    Read --> Pending: Marcar como pendiente con aviso

    Read --> Read: Editar valoración, reseña o mes de lectura
    Pending --> Pending: Editar título, autor, tipo, portada o sinopsis
```

Regla asociada al cambio de `read` a `pending`:

```txt
Si un Tome pasa de read a pending,
se eliminan rating, review y readMonth.
```

---

## 4.Flujo de añadir Tome

```mermaid
flowchart TD
    A[Usuario entra en Añadir tomo] --> B[Introduce título y autor]
    B --> C[Selecciona tipo: manga o literatura]
    C --> D[Selecciona estado]

    D -->|Pendiente| E[No se muestran valoración, reseña ni mes de lectura]
    D -->|Leída| F[Se muestran rating, review y readMonth]

    F --> G[Usuario introduce rating obligatorio]
    G --> H[Usuario puede añadir review y readMonth]
    H --> I[Guardar lectura]

    E --> I[Guardar lectura]

    I --> J{¿Ya existe ese Tome para el usuario?}
    J -->|Sí| K[Mostrar error: lectura ya guardada]
    J -->|No| L[Consultar APIs externas]

    L --> M{¿Las APIs devuelven portada o sinopsis?}
    M -->|Sí| N[Guardar Tome con datos enriquecidos]
    M -->|No| O[Guardar Tome sin portada o sin sinopsis]

    N --> P[Mostrar Tome en su lista correspondiente]
    O --> P
```

---

## 5.Flujo de cambio de estado

```mermaid
flowchart TD
    A[Usuario edita un Tome] --> B{Estado actual}

    B -->|Pending| C[Usuario marca como leído]
    C --> D[Se habilita rating obligatorio]
    D --> E[Usuario puede añadir review y readMonth]
    E --> F[Guardar cambios]
    F --> G[Tome pasa a lista de leídas]

    B -->|Read| H[Usuario marca como pendiente]
    H --> I[Mostrar aviso de eliminación]
    I --> J{¿Confirma el cambio?}

    J -->|No| K[Se mantiene como leído]
    J -->|Sí| L[Eliminar rating, review y readMonth]
    L --> M[Guardar cambios]
    M --> N[Tome pasa a lista de pendientes]
```