-- supabase/tests/0001_init_test.sql
-- Run after `supabase db reset` to sanity-check constraints.
begin;

insert into auth.users (id, email) values ('00000000-0000-0000-0000-000000000001', 'a@example.com');
insert into profiles (id, display_name) values ('00000000-0000-0000-0000-000000000001', 'Alice');

insert into posts (id, author_id, video_id, status)
values ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'cf-video-1', 'ready');

-- action event without datetime/location must fail
do $$
begin
  begin
    insert into events (post_id, organizer_id, title, type)
    values ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Cleanup', 'action');
    raise exception 'expected constraint violation, got success';
  exception when check_violation then
    null; -- expected
  end;
end $$;

-- comment with both post_id and event_id must fail
insert into events (id, post_id, organizer_id, title, type)
values ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Discuss', 'discussion');

do $$
begin
  begin
    insert into comments (post_id, event_id, author_id, body)
    values ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', 'bad');
    raise exception 'expected constraint violation, got success';
  exception when check_violation then
    null; -- expected
  end;
end $$;

rollback;
