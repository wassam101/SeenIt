<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project notes for picking this up in a new session

- **Location**: this project was moved out of OneDrive on purpose (it was syncing `.next`/`node_modules` mid-build and corrupting the build cache). Do not move it back into a OneDrive/Dropbox-synced folder.
- **Run it**: double-click `Start SeenIt.bat` in this folder (starts Docker if needed, starts local Supabase, starts the dev server, opens the browser), or manually: `npx supabase start` then `npm run dev`. App runs at http://localhost:3000.
- **Local Supabase data persists** in Docker volumes keyed by `project_id = "seenit-v1"` in `supabase/config.toml` — independent of this folder's path, so it survives moves/copies of the project folder. It does NOT survive `npx supabase db reset`, which wipes all data and re-applies migrations from scratch. There is no `supabase/seed.sql` yet, so after a reset the demo accounts/posts below need to be recreated manually via the Supabase REST/Auth admin API (ask Claude — this was done a few times already in chat history, the recipe is straightforward: create auth users via `POST /auth/v1/admin/users` with the service role key, insert matching `profiles` rows, upload images to the `post-media`/`avatars` storage buckets, insert `posts`/`likes`/`comments`/`follows`/`events` rows via PostgREST).
- **Demo accounts** (password for all: `demoPass123`): `wassam.design.test@example.com` (has a real profile photo set), `jordan.demo@example.com`, `maria.demo@example.com`, `devon.demo@example.com`, `priya.demo@example.com`.
- **Stack**: Next.js pinned to 14.2.35 (cookies() is sync — do not upgrade without checking that breaking change), Tailwind v4 (CSS-first config, see `app/globals.css`), Supabase (Postgres + Auth + Storage, local via Docker), brand colors are CSS vars in `app/globals.css` (`--color-teal`, `--color-signal` is the app's red, `--color-caution` is gold).
- **Features built so far**: posts can be photo or video (video needs a real Cloudflare Stream account — currently placeholder creds in `.env.local`, so video upload doesn't actually work locally), SeenIt/Share/Report actions, events with join, public profile pages at `/u/[id]` with one-way follow (Instagram/X style, no approval step), account settings at `/account` (name, DOB, bio, avatar, anonymous-posting toggle), geolocation "share my location" with Mapbox reverse geocoding (needs a real `NEXT_PUBLIC_MAPBOX_TOKEN` to resolve real addresses).
- **GitHub**: pushed to `https://github.com/wassam101/SeenIt`, branch `master`.
