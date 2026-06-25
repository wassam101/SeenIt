import { cookies } from 'next/headers'
import { PostCard } from '@/components/PostCard'

async function getSavedPosts() {
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/saved`, {
    cache: 'no-store',
    headers: { cookie: cookieHeader },
  })
  if (!res.ok) return []
  const json = await res.json()
  return json.posts
}

export default async function SavedPage() {
  const posts = await getSavedPosts()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display font-bold text-3xl leading-snug">Saved</h1>
      <p className="font-sans text-sm text-slate mt-1">Posts you've added to your library.</p>

      <div className="mt-8 border-t border-evidence pt-6">
        {posts.length === 0 ? (
          <p className="font-sans text-sm text-slate border border-dashed border-evidence px-3 py-6 text-center">
            Nothing saved yet. Tap the bookmark icon on a post to add it here.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {posts.map((post: any) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
