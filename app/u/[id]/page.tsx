import { cookies } from 'next/headers'
import { Avatar } from '@/components/Avatar'
import { FollowButton } from '@/components/FollowButton'
import { ProfileTimeline } from '@/components/ProfileTimeline'

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
      <div className="flex items-center gap-5">
        <Avatar name={profile.displayName} avatarUrl={profile.avatarUrl} size={88} />
        <div className="flex-1">
          <h1 className="font-display font-bold text-3xl leading-snug">{profile.displayName}</h1>
          <p className="font-sans text-sm text-slate mt-1">
            {profile.followerCount} {profile.followerCount === 1 ? 'follower' : 'followers'} · {profile.followingCount} following
          </p>
        </div>
        {!profile.isSelf && (
          <div className="flex items-center gap-2">
            <FollowButton userId={profile.id} initiallyFollowing={profile.isFollowing} />
            <span
              aria-disabled="true"
              title="Coming soon"
              className="font-sans text-sm font-semibold rounded-full px-4 py-2 border border-evidence text-slate/50 cursor-default"
            >
              Message
            </span>
          </div>
        )}
      </div>

      {profile.bio && <p className="text-sm text-ink/80 mt-4 max-w-md leading-snug">{profile.bio}</p>}

      <div className="mt-8 border-t border-evidence pt-6">
        <p className="font-sans text-sm text-slate mb-4">
          {profile.postsCount} {profile.postsCount === 1 ? 'report' : 'reports'}
        </p>
        <ProfileTimeline userId={profile.id} initialPosts={profile.posts} initialNextCursor={profile.nextPostsCursor} />
      </div>
    </div>
  )
}
