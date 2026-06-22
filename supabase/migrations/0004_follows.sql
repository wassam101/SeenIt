-- supabase/migrations/0004_follows.sql
-- One-directional follow relationships, like Instagram/X rather than Facebook's mutual-approval friending.

create table follows (
  follower_id uuid not null references profiles(id),
  followed_id uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  constraint follows_not_self check (follower_id <> followed_id)
);
create index follows_followed_id_idx on follows (followed_id);

alter table follows enable row level security;

create policy "follows are publicly readable" on follows for select using (true);
create policy "users follow as self" on follows for insert with check (auth.uid() = follower_id);
create policy "users unfollow as self" on follows for delete using (auth.uid() = follower_id);
