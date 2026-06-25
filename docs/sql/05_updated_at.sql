-- 05_updated_at.sql
-- Actualización automática de updated_at en profiles y tomes.
--
-- Ambas tablas tienen la columna updated_at con default now(), pero sin
-- trigger ese valor solo refleja la fecha de creación. Estos triggers
-- la refrescan en cada UPDATE.
--
-- Propósito por tabla:
--   - profiles.updated_at → informativo. Registra cuándo se modificó el
--     perfil por última vez (nombre, nick, avatar, etc.). No alimenta
--     filtros ni ordenación en la app.
--   - tomes.updated_at → funcional. Base para filtros y ordenación por
--     última modificación de una lectura (edición, cambio de estado,
--     valoración, reseña, etc.).
--
-- Una sola función reutilizable; un trigger por tabla.

-- =========================================================
-- Función: set_updated_at
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $function$
begin
    new.updated_at = now();
    return new;
end;
$function$;

-- =========================================================
-- Trigger: profiles_set_updated_at
-- Propósito: dato informativo fiable en el perfil del usuario.
-- =========================================================

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- =========================================================
-- Trigger: tomes_set_updated_at
-- Propósito: soporte para filtros y ordenación por última modificación.
-- =========================================================

create trigger tomes_set_updated_at
before update on public.tomes
for each row
execute function public.set_updated_at();
