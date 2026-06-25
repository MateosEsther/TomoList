-- 04_handle_new_user.sql
-- Creación automática del perfil al registrarse un usuario.
--
-- Cuando Supabase Auth inserta un usuario en auth.users, el trigger
-- on_auth_user_created ejecuta handle_new_user(), que crea la fila
-- correspondiente en public.profiles.
--
-- Detalles:
--   - name y surname se leen de raw_user_meta_data (enviados desde el
--     signUp del frontend en options.data).
--   - display_name se inicializa con el valor de name.
--   - avatar_id arranca con 'avatar-01' por defecto.
--   - SECURITY DEFINER permite insertar en profiles sin necesidad de una
--     política RLS de INSERT para los usuarios autenticados.

-- =========================================================
-- Función: handle_new_user
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
    insert into public.profiles (
        id,
        name,
        surname,
        display_name,
        avatar_id
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'surname', ''),
        coalesce(new.raw_user_meta_data->>'name', ''),
        'avatar-01'
    );
    return new;
end;
$function$;

-- =========================================================
-- Trigger: on_auth_user_created
-- Ejecuta la función tras cada alta en auth.users.
-- =========================================================

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
