-- 01_schema.sql
-- Esquema de las tablas principales de TomoList en Supabase.

-- =========================================================
-- Tabla: profiles
-- =========================================================

create table public.profiles (
id uuid not null,
name text null,
surname text null,
display_name text null,
avatar_id text null default 'avatar-01',
created_at timestamp with time zone not null default now(),
updated_at timestamp with time zone not null default now(),

```
constraint profiles_pkey primary key (id),

constraint profiles_id_fkey foreign key (id)
    references auth.users (id)
    on delete cascade
```

);

-- =========================================================
-- Tabla: tomes
-- =========================================================

create table public.tomes (
id uuid not null default gen_random_uuid(),
user_id uuid not null,

```
title text not null,
title_normalized text generated always as (lower(btrim(title))) stored null,

author text not null,
author_normalized text generated always as (lower(btrim(author))) stored null,

type text not null,
status text not null,

cover_url text null,
synopsis text null,

read_month text null,
rating integer null,
review text null,

created_at timestamp with time zone not null default now(),
updated_at timestamp with time zone not null default now(),

constraint tomes_pkey primary key (id),

constraint tomes_unique_per_user unique (
    user_id,
    title_normalized,
    author_normalized,
    type
),

constraint tomes_user_id_fkey foreign key (user_id)
    references public.profiles (id)
    on delete cascade,

constraint tomes_pending_has_no_read_data check (
    status <> 'pending'
    or (
        rating is null
        and review is null
        and read_month is null
    )
),

constraint tomes_status_check check (
    status = any (array['pending'::text, 'read'::text])
),

constraint tomes_type_check check (
    type = any (array['manga'::text, 'literature'::text])
),

constraint tomes_read_requires_rating check (
    status <> 'read'
    or rating is not null
),

constraint tomes_rating_check check (
    rating is null
    or (
        rating >= 1
        and rating <= 5
    )
),

constraint tomes_read_month_check check (
    read_month is null
    or read_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'::text
)
```

);
