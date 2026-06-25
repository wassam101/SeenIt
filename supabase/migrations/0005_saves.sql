create table saves (
  post_id uuid not null references posts(id),
  user_id uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table saves enable row level security;

create policy "users read own saves" on saves for select using (auth.uid() = user_id);
create policy "users insert own saves" on saves for insert with check (auth.uid() = user_id);
create policy "users delete own saves" on saves for delete using (auth.uid() = user_id);

grant select, insert, update, delete on saves to anon, authenticated, service_role;
