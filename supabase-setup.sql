-- TOPLEAKS complete Supabase setup.
-- Run in Supabase SQL Editor. Safe to rerun.
-- videos.id is UUID. Social video_id is text to accept the app's string IDs.

create extension if not exists pgcrypto;

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text,
  description text,
  thumbnail_url text,
  video_url text,
  duration_seconds integer,
  price_fc integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.videos enable row level security;
grant select on public.videos to anon, authenticated;
grant insert, update, delete on public.videos to authenticated;

drop policy if exists "videos_lecture_publique" on public.videos;
drop policy if exists "Tout le monde peut voir les vidéos publiées" on public.videos;
drop policy if exists "videos_admin_tout" on public.videos;
create policy "videos_lecture_publique" on public.videos
for select to anon, authenticated using (published = true or public.is_admin());

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;
grant select on public.admins to authenticated;
drop policy if exists "admins_lecture_soi" on public.admins;
create policy "admins_lecture_soi" on public.admins
for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Admin-only writes on the catalog.
drop policy if exists "videos_admin_write" on public.videos;
create policy "videos_admin_write" on public.videos
for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "views_ajout_public" on public.video_views;
create table if not exists public.video_views (
  id bigint generated always as identity primary key,
  video_id uuid not null references public.videos(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.video_views enable row level security;
grant insert on public.video_views to anon, authenticated;
grant select on public.video_views to authenticated;
create policy "views_ajout_public" on public.video_views
for insert to anon, authenticated with check (true);
drop policy if exists "views_lecture_admin" on public.video_views;
create policy "views_lecture_admin" on public.video_views
for select to authenticated using (public.is_admin());

create table if not exists public.purchases (
  id bigint generated always as identity primary key,
  video_id uuid references public.videos(id) on delete set null,
  kind text not null default 'video',
  amount_fc integer not null,
  operator text,
  phone text,
  reference text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.purchases enable row level security;
grant select on public.purchases to authenticated;
drop policy if exists "achats_lecture_admin" on public.purchases;
create policy "achats_lecture_admin" on public.purchases
for select to authenticated using (public.is_admin());

create or replace view public.video_stats with (security_invoker = true) as
select v.id, v.title, v.artist, v.price_fc, v.published, v.created_at,
  (select count(*) from public.video_views w where w.video_id = v.id) as views,
  (select count(*) from public.purchases p where p.video_id = v.id and p.status = 'paid') as sales,
  (select coalesce(sum(p.amount_fc), 0) from public.purchases p where p.video_id = v.id and p.status = 'paid') as revenue_fc
from public.videos v;
grant select on public.video_stats to authenticated;

-- Profiles: optional display name and self-reported country.
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
create policy "Users can read own profile" on public.profiles
for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update to authenticated using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  raw_username text;
  raw_country text;
begin
  raw_username := nullif(trim(new.raw_user_meta_data ->> 'username'), '');
  raw_country := upper(trim(coalesce(new.raw_user_meta_data ->> 'country', '')));
  insert into public.profiles (id, username, country)
  values (new.id, coalesce(left(raw_username, 40), 'Utilisateur'),
    case when raw_country ~ '^[A-Z]{2}$' then raw_country else null end)
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;
drop trigger if exists create_profile_after_signup on auth.users;
create trigger create_profile_after_signup after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();

-- Likes and comments. Public can read; only the signed-in owner can write.
create table if not exists public.video_likes (
  id bigint generated always as identity primary key,
  video_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint video_likes_one_per_user unique (video_id, user_id)
);
create table if not exists public.video_comments (
  id bigint generated always as identity primary key,
  video_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
alter table public.video_likes enable row level security;
alter table public.video_comments enable row level security;
revoke all on public.video_likes, public.video_comments from anon, authenticated;
grant select on public.video_likes, public.video_comments to anon, authenticated;
grant insert, delete on public.video_likes to authenticated;
grant insert on public.video_comments to authenticated;
drop policy if exists "Anyone can read likes" on public.video_likes;
create policy "Anyone can read likes" on public.video_likes
for select to anon, authenticated using (true);
drop policy if exists "Users can like as themselves" on public.video_likes;
create policy "Users can like as themselves" on public.video_likes
for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can remove their own likes" on public.video_likes;
create policy "Users can remove their own likes" on public.video_likes
for delete to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Anyone can read comments" on public.video_comments;
create policy "Anyone can read comments" on public.video_comments
for select to anon, authenticated using (true);
drop policy if exists "Users can comment as themselves" on public.video_comments;
create policy "Users can comment as themselves" on public.video_comments
for insert to authenticated with check ((select auth.uid()) = user_id);
create index if not exists video_views_video_id_idx on public.video_views(video_id);
create index if not exists video_likes_video_id_idx on public.video_likes(video_id);
create index if not exists video_comments_video_created_idx on public.video_comments(video_id, created_at desc);

-- Public video storage. Uploads require an authenticated admin.
insert into storage.buckets (id, name, public) values ('videos', 'videos', true)
on conflict (id) do nothing;
drop policy if exists "videos_envoi_admin" on storage.objects;
create policy "videos_envoi_admin" on storage.objects
for insert to authenticated with check (bucket_id = 'videos' and public.is_admin());

-- After creating your account in Authentication > Users, make yourself admin:
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'YOUR_EMAIL';
