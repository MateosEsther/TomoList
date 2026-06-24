-- 02_rls_tomes.sql
-- Políticas RLS de la tabla tomes.

alter table public.tomes enable row level security;

-- =========================================================
-- SELECT
-- =========================================================

create policy "tomes_select_own"
on public.tomes
for select
to authenticated
using (auth.uid() = user_id);

-- =========================================================
-- INSERT
-- =========================================================

create policy "tomes_insert_own"
on public.tomes
for insert
to authenticated
with check (auth.uid() = user_id);

-- =========================================================
-- UPDATE
-- =========================================================

create policy "tomes_update_own"
on public.tomes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- =========================================================
-- DELETE
-- =========================================================

create policy "tomes_delete_own"
on public.tomes
for delete
to authenticated
using (auth.uid() = user_id);
