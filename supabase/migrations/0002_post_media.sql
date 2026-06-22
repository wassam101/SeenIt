-- supabase/migrations/0002_post_media.sql
-- Allow posts to be photos as well as videos.

alter table posts alter column video_id drop not null;
alter table posts add column media_type text not null default 'video' check (media_type in ('video', 'image'));
alter table posts add column image_url text;
alter table posts add constraint posts_media_fields_check check (
  (media_type = 'video' and video_id is not null) or (media_type = 'image' and image_url is not null)
);

insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do nothing;

create policy "post-media is publicly readable" on storage.objects for select using (bucket_id = 'post-media');
create policy "authenticated users upload post-media" on storage.objects for insert to authenticated with check (bucket_id = 'post-media');
