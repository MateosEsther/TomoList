# Arquitectura de TomoList

Este documento recoge la arquitectura definida para TomoList.

---

## 1.Arquitectura general

La arquitectura es la siguiente:

```txt
Frontend: React + Vite
Despliegue frontend: Vercel
Backend principal: Supabase
Base de datos: PostgreSQL en Supabase
Autenticación: Supabase Auth
Seguridad de datos: Row Level Security
```
Supabase actúa como servicio backend (autenticación, BD, reglas de seguridad y acceso a datos)
---

## 2.Frontend -> React, Vite, TypeScript

Desde la interfaz se puede:
- registrarse como usuari@
- iniciar y cerrar sesión
- recuperar contraseña
- gestionar su perfil
- gestionar lecturas (añadir, eliminar, editar, valorar y comentar lecturas)
- consultar listas 
- filtrar y buscar lecturas dentro de las listas

React se encarga de construir la interfaaz y gestionar el estado de los componentes. Vite como herramienta de desarrollo y
empaquetado y TypeScript para tipar estáticamente mejorando la seguirdad del código.
**La página "Mis listas" funciona como vista general de la biblioteca del usuario, mostrando accesos a las listas principales,
conteos de lecturas y resultados filtrados cuando el usuario realiza una búsqueda o aplica un filtro.

---

## 3.Backend -> Supabase

Se usa para:
- autenticación de usuari@s
- almacenamiento de datos en una base de datos PostgreSQL
- consultas de lecturas
- inserción de lecturas
- edición de lecturas
- eliminación de lecturas
- aplicar reglas de seguridad por usuari@ mediante Row Level Secyrity
- gestionar datos de perfil

El acceso a Supabase se hace desde el frontend mediante el cliente oficial de Supabase configurado en la app.

---

## 4.Base de datos -> PostgreSQL en Supabase

Tablas:
- profiles: información de perfil de usuari@
    campos: 
    - id
    - name
    - surname
    - display_name
    - avatar_id
    - created_at
    - updated_at
  
- tomes: lecturas personales por usuari@
    campos: 
    - id
    - user_id
    - title
    - title_normalized
    - author
    - author_normalized
    - type
    - status
    - cover_url
    - synopsis
    - read_month
    - rating
    - review
    - created_at
    - updated_at

Relaciones:
- profiles: con usuario autenticado de Supabase Auth
- tomes: mediante el campo `user_id` para asociar cada lectura a su user propietario

**`title` y `author` almacenan datos visiibles de la lectura mientras que `title_normalized` y `author_normalized` 
son para trabajar con versiones normalizadas de estos datos de utilidad en búsquedas, comparación y control de duplicados.
`type` distingue entre manga o literatura y `status` indica si la lectura está leída o pendiente.
Los campos `rating`, `read_month` y `review`almacenan datos pertenecientes solo al estado leída de lecturas.


---

## 5.Autenticación -> Supabase Auth

Permite:
- registros nuevos
- inicio de sesión
- cierre de sesión
- recuperación de contraseña
- mantenimiento de sesión activa en el navegador
- asociación de datos de la app con el user autenticado

---

## 6.Seguridad de datos -> Row Level Security

Regla principal: Cada usuari@ solo puede acceder a sus propios datos.

Se consigue asociando los registros privados al campo  `user_id` de la tabla tomes con `id` de la tabla profiles y
aplicando políticas RLS en Supabase.
Así, aunque las consultas se hagan desde el frontend, Supabase limita el acceso para que cada usuari@ 
solo tenga acceso a los registros que le pertenecen.

---

## 7.Despliegue frontend -> Vercel

El frontend se despliega en Vercel desde la carpeta `frontend/` del repositorio.

### Configuración del proyecto en Vercel

| Campo | Valor |
|-------|-------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Variables de entorno

Las mismas que en `frontend/.env.example`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_GOOGLE_BOOKS_API_KEY`

Se configuran en el panel de Vercel (Production y, si aplica, Preview). No se suben al repositorio.

### `frontend/vercel.json`

TomoList es una SPA con React Router. En producción, Vercel solo sirve `index.html` y los archivos estáticos de `dist/assets/`; no existe un archivo HTML por cada ruta (`/mis-listas`, `/listas/manga/read`, etc.).

Sin configuración adicional:

- navegar desde la home con enlaces internos suele funcionar;
- recargar una ruta o abrir una URL directa devuelve **404**.

El archivo `vercel.json` define un **rewrite**: cualquier ruta se resuelve contra `index.html`. React Router lee la URL del navegador y muestra la página correcta. Los archivos en `/assets/` se sirven antes del rewrite y no se ven afectados.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Supabase (URLs de autenticación)

Producción: **https://tomolist.vercel.app**

En **Supabase → Authentication → URL Configuration**:

- **Site URL:** `https://tomolist.vercel.app`
- **Redirect URLs:** incluir `https://tomolist.vercel.app/reset-password` y mantener `http://localhost:5173/reset-password` para desarrollo

Necesario para que la recuperación de contraseña funcione en producción.

La **confirmación de email** está activada en Supabase para usuarios reales.

### Google Books (restricción de API key)

En Google Cloud, los referrers HTTP de la API key incluyen:

```txt
http://localhost:5173/*
https://tomolist.vercel.app/*
```

La clave está restringida a **Books API**.