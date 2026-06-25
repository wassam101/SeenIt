create table messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles(id),
  recipient_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint messages_not_self check (sender_id <> recipient_id)
);
create index messages_recipient_idx on messages (recipient_id, created_at desc);
create index messages_sender_idx on messages (sender_id, created_at desc);

alter table messages enable row level security;

create policy "participants read their messages" on messages for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "users send as self" on messages for insert with check (auth.uid() = sender_id);
create policy "recipients mark their messages read" on messages for update using (auth.uid() = recipient_id);

grant select, insert, update, delete on messages to anon, authenticated, service_role;
