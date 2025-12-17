-- Supabase SQL migration: users table
-- Run via Supabase CLI or the SQL editor.

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  display_name text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger users_set_updated_at
before update on public.users
for each row
execute procedure public.set_current_timestamp_updated_at();

-- seed default admin
insert into public.users (username, password_hash, display_name, role)
values (
  'admin',
  crypt('admin', gen_salt('bf')),
  'Admin',
  'admin'
)
on conflict (username) do nothing;
