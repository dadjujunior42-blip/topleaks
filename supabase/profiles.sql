-- TOPLEAKS user profiles: run once in Supabase SQL Editor.
-- Stores only the user's self-reported username and optional country code.
-- Passwords and emails remain managed by Supabase Auth.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 1 and 40),
  country text check (country is null or country ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  raw_username text;
  raw_country text;
begin
  raw_username := nullif(trim(new.raw_user_meta_data ->> 'username'), '');
  raw_country := upper(trim(coalesce(new.raw_user_meta_data ->> 'country', '')));

  insert into public.profiles (id, username, country)
  values (
    new.id,
    coalesce(left(raw_username, 40), 'Utilisateur'),
    case when raw_country ~ '^[A-Z]{2}$' then raw_country else null end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;

drop trigger if exists create_profile_after_signup on auth.users;
create trigger create_profile_after_signup
after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();

-- To view aggregate counts by user-declared country in Supabase SQL Editor:
-- select country, count(*) as users
-- from public.profiles
-- where country is not null
-- group by country
-- order by users desc;
