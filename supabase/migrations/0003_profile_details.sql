-- supabase/migrations/0003_profile_details.sql
-- Profile details needed for a real social account: name parts, DOB, anonymity, bio, avatar bucket.

alter table profiles add column first_name text;
alter table profiles add column last_name text;
alter table profiles add column date_of_birth date;
alter table profiles add column is_anonymous boolean not null default false;
alter table profiles add column bio text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars are publicly readable" on storage.objects for select using (bucket_id = 'avatars');
create policy "authenticated users upload avatars" on storage.objects for insert to authenticated with check (bucket_id = 'avatars');
create policy "users update own avatar objects" on storage.objects for update to authenticated using (bucket_id = 'avatars' and owner = auth.uid());
