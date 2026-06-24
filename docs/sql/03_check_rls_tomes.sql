-- 03_check_rls_tomes.sql
-- Consulta para revisar el estado de RLS y las políticas de la tabla tomes.

select
c.relrowsecurity as rls_enabled,
p.policyname,
p.cmd,
p.roles,
p.qual as using_expression,
p.with_check as with_check_expression
from pg_class c
join pg_namespace n
on n.oid = c.relnamespace
left join pg_policies p
on p.schemaname = n.nspname
and p.tablename = c.relname
where n.nspname = 'public'
and c.relname = 'tomes'
order by p.cmd;
