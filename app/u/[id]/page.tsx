import { cookies } from 'next/headers'
import { Avatar } from '@/components/Avatar'
import { FollowButton } from '@/components/FollowButton'
import { PostCard } from '@/components/PostCard'

async function getProfile(id: string) {
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/users/${id}`, {
    cache: 'no-store',
    headers: { cookie: cookieHeader },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const profile = await getProfile(params.id)
  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="font-mono text-xs text-slate uppercase tracking-wider">404</p>
        <p className="font-display font-bold text-lg mt-1">This profile doesn&apos;t exist.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center gap-4">
        <Avatar name={profile.displayName} avatarUrl={profile.avatarUrl} size={64} />
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl leading-snug">{profile.displayName}</h1>
          <p className="font-mono text-xs text-slate mt-1">
            {profile.followerCount} {profile.followerCount === 1 ? 'follower' : 'followers'} · {profile.followingCount} following
          </p>
        </div>
        {!profile.isSelf && <FollowButton userId={profile.id} initiallyFollowing={profile.isFollowing} />}
      </div>

      {profile.bio && <p className="text-sm text-ink/80 mt-4 max-w-md leading-snug">{profile.bio}</p>}

      <div className="mt-8 border-t border-evidence pt-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-4">
          {profile.posts.length} {profile.posts.length === 1 ? 'report' : 'reports'}
        </p>
        {profile.posts.length === 0 ? (
          <p className="font-mono text-xs text-slate border border-dashed border-evidence px-3 py-6 text-center">
            No reports yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {profile.posts.map((post: any) => (
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
