-- 03_rls_profiles.sql
-- Políticas RLS de la tabla profiles.
--
-- Cada usuario autenticado solo puede acceder a su propia fila
-- (la que tiene id igual a auth.uid()).
--
-- Notas:
--   - No hay política de DELETE: el perfil se elimina en cascada cuando
--     se borra el usuario en auth.users (ver profiles_id_fkey en 01_schema.sql).
--   - La política de INSERT cubre un alta manual del propio usuario; el alta
--     habitual la realiza la función handle_new_user con SECURITY DEFINER
--     (ver 04_handle_new_user.sql), que se salta el RLS.

alter table public.profiles enable row level security;

-- =========================================================
-- SELECT
-- =========================================================

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- =========================================================
-- INSERT
-- =========================================================

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- =========================================================
-- UPDATE
-- =========================================================

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
