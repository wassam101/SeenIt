# SeenIt — V1 Design

## Purpose

SeenIt lets people post short videos of situations they've witnessed (e.g. local issues, wrongdoing, hazards) so others can see, react to, and organize around them. Beyond standard social engagement (like, comment, repost), any member can start an "event" on a post to group people who want to discuss or act on the issue, escalating it from a single video into a coordinated effort.

## Phasing

This spec covers a lean V1 — the core posting/engagement/event loop. Deferred to V2: direct (DM-style) sharing, full event management (RSVP status, sub-tasks, multiple organizer roles), and an in-app moderation/admin dashboard. V1 ships with manual moderation (operator reviews reports directly in the database) and a single organizer role with a plain member list per event.

## Platform & Stack

- **Frontend/Backend**: Next.js (App Router), single codebase, deployed to Vercel. Web-first; architecture (separate API-shaped routes) is portable to a future native app.
- **Database & Auth**: Supabase — Postgres database, email/password auth with verification, Storage for avatars/thumbnails.
- **Video**: Cloudflare Stream (or Mux) — handles upload, transcoding, adaptive playback, thumbnail generation. Client uploads directly to the video service via a signed upload URL; raw video bytes never pass through our own server.
- **Location/Maps**: Mapbox — pin drop / address search on post creation, map or list view for the "Nearby" feed tab.

Rationale: this is a real product intended for a solo/small team, so the design favors managed services for the hardest infra problems (video transcoding, geo, auth) over self-hosting them, keeping the team's effort on product logic.

## Data Model

- `users`: id, email, display_name, avatar_url, created_at
- `posts`: id, author_id, video_id (Cloudflare Stream ref), thumbnail_url, caption, lat, lng, location_label, status (`processing`/`ready`), deleted_at, created_at
- `likes`: post_id, user_id, created_at — unique on (post_id, user_id)
- `comments`: id, post_id (nullable), event_id (nullable, exactly one of post_id/event_id set), author_id, body, deleted_at, created_at
- `reposts`: id, post_id, user_id, created_at — a repost is a reference to the original post, not a video copy; shown as "Reposted by X" in the reposter's profile and followers' feeds
- `reports`: id, target_type (`post`/`comment`), target_id, reporter_id, reason, status (`open`/`reviewed`), created_at
- `events`: id, post_id, organizer_id, title, description, type (`discussion`/`action`), event_datetime (nullable, required if type=action), location_label (nullable, required if type=action), created_at
- `event_members`: event_id, user_id, joined_at — unique on (event_id, user_id)

Comments use a single table with a nullable `post_id`/`event_id` rather than separate tables, so comment UI/logic isn't duplicated between posts and events.

## Core Flows

1. **Post creation**: user records/selects a video → client requests a signed upload URL from the server → uploads directly to Cloudflare Stream → post row created with status `processing` → on the service's "ready" webhook, status flips to `ready` and the post becomes visible in feeds. Caption and location pin (via Mapbox) are set at creation time.

2. **Feeds**: two tabs — "Global" (paginated, reverse-chronological over all `ready`, non-deleted posts) and "Nearby" (same query filtered by a lat/lng bounding box around the user's current or manually-picked location; no PostGIS needed at V1 scale, plain range query suffices).

3. **Engagement**:
   - Like/unlike toggles a `likes` row (idempotent via unique constraint).
   - Comments are flat (no nested replies in V1).
   - Repost creates a `reposts` row; visible on the reposter's profile and in followers' feeds with attribution to the original poster.

4. **Starting an event**: any logged-in member sees a "Start Event" icon on a post. They pick a type (`discussion` or `action`), fill in title/description, and — if `action` — a date/time and location. The creator becomes the event's organizer. Multiple events can exist per post (no exclusivity). The event appears as a section on the source post and in a dedicated `/events` listing.

5. **Joining an event**: joining adds a row to `event_members` and grants access to post in that event's shared comment thread (a `comments` row scoped via `event_id`). No RSVP states or sub-tasks in V1 — just "joined" or not.

6. **Reporting**: a report icon on posts and comments opens a reason picklist and creates a `reports` row with status `open`. There is no in-app admin UI in V1; the operator reviews open reports directly via Supabase's table view/SQL and can soft-delete (`deleted_at`) or otherwise act on content manually.

## Error Handling & Edge Cases

- **Upload failure**: client-side failure offers a retry. If upload succeeds but the "ready" webhook never arrives within a timeout, the post stays in `processing`, visible only to its author, with a manual retry action.
- **Duplicate actions**: likes and event joins are protected by DB unique constraints, so repeated clicks are no-ops rather than errors.
- **Content removal**: posts and comments are soft-deleted (`deleted_at`) rather than hard-deleted, so reposts and event references referring to them don't break, and removed content remains reviewable/restorable by the operator.
- **Auth boundaries**: all write routes (post, like, comment, create event, join event, report) require an authenticated session. Reads (feed, post detail, event detail) are public/unauthenticated, so an issue can be seen and escalated awareness-wise even by non-members — this fits the goal of surfacing and escalating witnessed issues.
- **Location permission denied**: if the browser denies geolocation, the "Nearby" tab falls back to a manual location search/pin rather than failing outright.

## Testing Approach

- **Unit tests**: feed query logic (global + nearby bounding box), like/join idempotency, event field validation (e.g. `action` type requires `event_datetime` and `location_label`).
- **Integration tests**: API routes for post creation (through to DB row), like/unlike, comment creation (post-scoped and event-scoped), event creation + join, and report creation — run against a test Postgres schema (Supabase local dev).
- **E2E smoke test**: one Playwright flow — signup → post video → like/comment → start event → join event — run before each deploy.
- Video transcoding itself is not tested directly (trusted to Cloudflare Stream); tests cover only that the app correctly requests upload URLs and reacts to ready/error webhooks.

## Out of Scope for V1 (explicitly deferred)

- Direct/DM-style sharing (V1 has public repost only)
- Event RSVP states, sub-tasks, multiple organizer roles
- In-app moderation/admin dashboard (V1 is manual review of `reports`)
- Nested comment replies
- Native mobile app (architecture is portable to one later, but not built in V1)
