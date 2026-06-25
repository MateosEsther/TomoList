# Scripts SQL de TomoList

Esta carpeta contiene los scripts SQL relacionados con la base de datos de TomoList en Supabase.

La finalidad es guardar en el repositorio los cambios importantes del modelo de datos, las políticas RLS, funciones y triggers que formen parte del proyecto.

## Estructura

```txt
docs/sql/
├── 01_schema.sql              # esquema de tablas
├── 02_rls_tomes.sql           # políticas RLS de tomes
├── 03_rls_profiles.sql        # políticas RLS de profiles
├── 04_handle_new_user.sql     # función y trigger de creación de perfil
├── 05_updated_at.sql          # triggers de actualización automática de updated_at
├── README.md
└── checks/                    # consultas de diagnóstico (solo lectura)
    ├── 01_check_rls_tomes.sql
    └── 02_check_profiles_and_triggers.sql
```

### Scripts de definición (raíz de `sql/`)

Documentan lo que **debe existir** en Supabase: tablas, políticas RLS, funciones y triggers. Están numerados en orden de despliegue, de modo que ejecutándolos del `01` en adelante se reconstruye la base de datos desde cero.

### Scripts de comprobación (`checks/`)

Son consultas de **solo lectura** para inspeccionar el estado actual de la base de datos (por ejemplo, si RLS está activado o qué políticas existen). No crean ni modifican nada. Se ejecutan en el SQL Editor de Supabase cuando hace falta diagnosticar. Tienen su propia numeración, independiente de la de los scripts de definición.

## Contenido previsto

- esquema de tablas
- políticas Row Level Security
- funciones de Supabase
- triggers
- cambios posteriores del modelo de datos

