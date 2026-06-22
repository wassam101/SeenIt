# UI fixes batch — design

Date: 2026-06-22

## Summary

Six independent fixes/features identified during manual testing of the live app:

1. Feed tab ("Seen Global"/"Seen Nearby") active state should use brand teal, not the current dark "ink" color.
2. Photo/video upload button reported as non-functional by the user — investigated, found working in code; flagged for re-test.
3. "Share my location" should resolve to a human-readable place name, not raw lat/lng.
4. Clicking a user's name should go to their profile/timeline — already implemented; documented as-is.
5. "Post anonymously" should move from a permanent account setting to a per-post/per-comment choice made at the moment of posting.
6. Clicking a user's avatar should open it in a larger preview (lightbox).

## 1. Feed tab color

**File:** `components/FeedTabs.tsx`

Active tab button changes from `bg-ink text-paper` to `bg-teal text-paper`. Inactive tab styling (`text-slate hover:text-ink`) is unchanged. This is a one-line className change, no behavior change.

## 2. Upload button

**Investigation result:** `app/post/new/page.tsx` wires a hidden `<input type="file">` to a visible `<label>` button via `htmlFor`/`id`, with a working `onChange` handler that sets a preview. Verified via live browser automation: clicking "Choose photo or video" opens the native file picker correctly, no console errors, no blocking overlay in the DOM.

**Decision:** No code change in this batch. If the issue persists for the user on manual re-test, we need the specific browser/extension/OS combination to reproduce it — that's a separate follow-up, not blocked on this batch.

## 3. Location → place names

**Current:** `lib/location/reverse-geocode.ts` calls the Mapbox Geocoding API, which requires `NEXT_PUBLIC_MAPBOX_TOKEN`. The token is a placeholder in this dev environment, so the call silently fails and the UI falls back to raw `lat, lng` text.

**Change:** Replace the Mapbox call with a call to OpenStreetMap's Nominatim reverse-geocoding endpoint (`https://nominatim.openstreetmap.org/reverse`), which requires no API key. Build a short label from the response (e.g. road + neighborhood/city, falling back to display_name truncated). Keep the existing raw-coordinate fallback for when the network call fails entirely (offline, rate-limited, etc.) so location-sharing never silently breaks.

Nominatim's usage policy requires a `User-Agent` identifying the app and a reasonable request rate (this is a low-traffic local-dev/community app, well within free-tier norms) — set a descriptive `User-Agent` header on the fetch.

## 4. Click name → profile timeline

**Current state (no change needed):** `/u/[id]` (`app/u/[id]/page.tsx`) already renders avatar, follower/following counts, bio, and a reverse-chronological list of the user's own posts via `PostCard` — i.e., a timeline. `PostCard.tsx` wraps the author name/avatar in a `Link` to `/u/[authorId]` whenever the post isn't anonymous (`post.authorId` is non-null). For anonymous posts/comments, no link is rendered, by design — anonymity must actually hide identity.

This item is documentation only; behavior is verified correct once item 5 lands (since anonymity becomes per-post rather than a blanket account state).

## 5. Per-post/per-comment anonymous posting

**Current:** `profiles.is_anonymous` is a permanent boolean set in Account Settings (`components/AccountForm.tsx`). Every post and comment by that user is anonymized uniformly, computed via `lib/profile/public-name.ts`'s `publicDisplayName`/`publicAvatarUrl` helpers, which read the joined `profiles.is_anonymous` value in: `app/api/posts/[id]/route.ts`, `app/api/feed/route.ts`, `app/api/posts/[id]/comments/route.ts`, `app/api/events/[id]/comments/route.ts`, `app/api/events/[id]/members/route.ts`, `app/api/users/[id]/route.ts`, `app/layout.tsx`.

**New design:**

- **Schema:** new migration adds `is_anonymous boolean not null default false` to both `posts` and `comments` tables. The `profiles.is_anonymous` column and its account-settings checkbox are removed (full migration scope, confirmed with user — no "default" carry-over).
- **Post composer** (`app/post/new/page.tsx`): add a checkbox "Post anonymously" near the caption field. On submit, include `isAnonymous` in the `/api/posts` POST body; `app/api/posts/route.ts` (POST handler) writes it to the new `posts.is_anonymous` column.
- **Comment composer** (`components/CommentThread.tsx`): add the same checkbox next to the comment input. POST to `/api/posts/[id]/comments` and `/api/events/[id]/comments` includes `isAnonymous`; both POST handlers write it to `comments.is_anonymous`.
- **Read paths:** `publicDisplayName`/`publicAvatarUrl` in `lib/profile/public-name.ts` change signature to take the *post or comment's own* `is_anonymous` flag instead of the profile's. Every GET route listed above is updated to pass the post/comment-level flag instead of the profile-level one, and to null out `authorId` per-item rather than per-account.
- **Account settings / header:** `AccountForm.tsx` loses the "Post and comment anonymously" checkbox and the `isAnonymous` field in `app/account/actions.ts`. `app/layout.tsx`'s header always shows the real logged-in user's name/avatar (anonymity no longer applies to "who's logged in," only to "what's attributed to a given post/comment").

**Out of scope:** retroactively anonymizing/de-anonymizing existing posts/comments — existing rows get `is_anonymous = false` (their author was already attributed) via the migration default.

## 6. Avatar click → lightbox

**Current:** `components/Avatar.tsx` renders a plain `<img>` (or an initials `<span>` if no photo) with no interactivity.

**Change:** Wrap the photo case in a button; clicking it opens a simple modal/lightbox showing the same image at a larger size (e.g. 320px, centered, with a dismiss-on-backdrop-click and Escape-to-close). Initials-only avatars (no `avatarUrl`) stay non-interactive — there's no photo to enlarge.

Implementation: extend `Avatar` to manage its own open/closed lightbox state internally (keeps call sites in `PostCard`, `CommentThread`, profile page, and header unchanged) — no new props required at call sites.

## Testing

- Manual verification in browser for each visual item (tab color, lightbox, location label).
- For the anonymous-posting migration: verify via Supabase Studio that new posts/comments persist the correct `is_anonymous` value, and that the feed/profile/comments API responses correctly null out `authorId` per-item.
