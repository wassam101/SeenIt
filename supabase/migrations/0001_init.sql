-- supabase/migrations/0001_init.sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id),
  video_id text not null,
  thumbnail_url text,
  caption text,
  lat double precision,
  lng double precision,
  location_label text,
  status text not null default 'processing' check (status in ('processing', 'ready')),
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
create index posts_created_at_idx on posts (created_at desc) where deleted_at is null;
create index posts_lat_lng_idx on posts (lat, lng) where deleted_at is null;

create table events (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id),
  organizer_id uuid not null references profiles(id),
  title text not null,
  description text,
  type text not null check (type in ('discussion', 'action')),
  event_datetime timestamptz,
  location_label text,
  created_at timestamptz not null default now(),
  constraint events_action_fields_check check (
    type = 'discussion' or (event_datetime is not null and location_label is not null)
  )
);
create index events_post_id_idx on events (post_id);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id),
  event_id uuid references events(id),
  author_id uuid not null references profiles(id),
  body text not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  constraint comments_target_check check (
    (post_id is not null and event_id is null) or (post_id is null and event_id is not null)
  )
);
create index comments_post_id_idx on comments (post_id, created_at) where deleted_at is null;
create index comments_event_id_idx on comments (event_id, created_at) where deleted_at is null;

create table likes (
  post_id uuid not null references posts(id),
  user_id uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table reposts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id),
  user_id uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('post', 'comment')),
  target_id uuid not null,
  reporter_id uuid not null references profiles(id),
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewed')),
  created_at timestamptz not null default now()
);

create table event_members (
  event_id uuid not null references events(id),
  user_id uuid not null references profiles(id),
  joined_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

alter table profiles enable row level security;
alter table posts enable row level security;
alter table events enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;
alter table reposts enable row level security;
alter table reports enable row level security;
alter table event_members enable row level security;

create policy "profiles are publicly readable" on profiles for select using (true);
create policy "users manage own profile" on profiles for all using (auth.uid() = id);

create policy "ready posts are publicly readable" on posts for select using (deleted_at is null);
create policy "authors insert own posts" on posts for insert with check (auth.uid() = author_id);
create policy "authors update own posts" on posts for update using (auth.uid() = author_id);

create policy "events are publicly readable" on events for select using (true);
create policy "members insert events" on events for insert with check (auth.uid() = organizer_id);

create policy "comments are publicly readable" on comments for select using (deleted_at is null);
create policy "authors insert own comments" on comments for insert with check (auth.uid() = author_id);

create policy "likes are publicly readable" on likes for select using (true);
create policy "users insert own likes" on likes for insert with check (auth.uid() = user_id);
create policy "users delete own likes" on likes for delete using (auth.uid() = user_id);

create policy "reposts are publicly readable" on reposts for select using (true);
create policy "users insert own reposts" on reposts for insert with check (auth.uid() = user_id);

create policy "reporters read own reports" on reports for select using (auth.uid() = reporter_id);
create policy "users insert own reports" on reports for insert with check (auth.uid() = reporter_id);

create policy "members are publicly readable" on event_members for select using (true);
create policy "users join events as self" on event_members for insert with check (auth.uid() = user_id);
