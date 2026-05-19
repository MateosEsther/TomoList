# Arquitectura de TomoList

Este documento recoge la arquitectura definida para TomoList.

---

## 1.Arquitectura general

Tendrá la siguiente arquitectura:

```txt
Frontend: React + Vite
Despliegue frontend: Vercel
Backend principal: Supabase
Base de datos: PostgreSQL en Supabase
Autenticación: Supabase Auth
Seguridad de datos: Row Level Security
```

---

## 2.Frontend -> React, Vite, TypeScript

Permitirá al usuari@:
- registrarse
- iniciar sesión
- recuperar contraseña
- gestionar su perfil
- gestionar lecturas (añadir, eliminar, editar, valorar y comentar lecturas)
- consultar sus listas

---

## 3.Backend -> Supabase

Se usará para:
- autenticación de usuari@s
- base de datos
- consultas de lecturas
- inserción de lecturas
- edición de lecturas
- eliminación de lecturas
- reglas de seguridad por usuari@

---

## 4.Base de datos -> PostgreSQL en Supabase

Tablas:
- profiles: información de perfil de usuari@
- tomes: lecturas personales por usuari@

---

## 5.Autenticación -> Supabase Auth

Permitirá:
- registro
- inicio de sesión
- cierre de sesión
- recuperación de contraseña
- mantenimiento de sesión

---

## 6.Seguridad de datos -> Row Level Security

Regla principal: Cada usuari@ solo puede acceder a sus propios datos.
Se gestionará mediante el campo `user_id` para asociar cada lectura con su usuari@ propietari@


