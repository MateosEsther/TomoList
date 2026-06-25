-- 02_check_profiles_and_triggers.sql
-- Consultas de diagnóstico para revisar el estado real de la BD en Supabase.
-- Ejecutar cada bloque en el SQL Editor de Supabase y anotar el resultado.
-- Cubre los pendientes: 1 (RLS de profiles), 2 (handle_new_user) y 3 (updated_at).

-- =========================================================
-- 1. RLS y políticas de la tabla profiles
--    (mismo patrón que 01_check_rls_tomes.sql pero para profiles)
-- =========================================================
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
    and c.relname = 'profiles'
order by p.cmd;

-- =========================================================
-- 2. Función handle_new_user (creación automática del perfil al registrarse)
--    Si devuelve una fila, copiar la columna "definition" para documentarla.
-- =========================================================
select
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n
    on n.oid = p.pronamespace
where p.proname = 'handle_new_user';

-- =========================================================
-- 3. Triggers existentes sobre auth.users, public.profiles y public.tomes
--    - El trigger de handle_new_user suele estar sobre auth.users.
--    - Los triggers de updated_at estarían sobre profiles y tomes.
-- =========================================================
select
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_name,
    action_timing,
    event_manipulation,
    action_statement
from information_schema.triggers
where event_object_table in ('users', 'profiles', 'tomes')
order by table_schema, table_name, trigger_name;
