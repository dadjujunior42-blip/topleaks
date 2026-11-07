-- TOPLEAKS social actions: run this once in Supabase SQL Editor.
-- video_id is text intentionally, so it works with either numeric or UUID video IDs.
-- A user can only create/delete their own likes and comments; reads are public.

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

create index if not exists video_likes_video_id_idx on public.video_likes(video_id);
create index if not exists video_comments_video_created_idx on public.video_comments(video_id, created_at desc);
