import Link from 'next/link'
import { cookies } from 'next/headers'
import { Avatar } from '@/components/Avatar'
import { ChatThread } from '@/components/ChatThread'

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

export default async function MessageThreadPage({ params }: { params: { id: string } }) {
  const profile = await getProfile(params.id)
  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="font-display font-bold text-lg">This person doesn&apos;t exist.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 57px)' }}>
      <div className="flex items-center gap-3 pb-4 border-b border-evidence">
        <Link href="/messages" className="font-sans text-sm text-slate hover:text-ink transition-colors">
          &larr;
        </Link>
        <Link href={`/u/${profile.id}`} className="flex items-center gap-2 hover:text-teal transition-colors">
          <Avatar name={profile.displayName} avatarUrl={profile.avatarUrl} size={32} />
          <span className="font-display font-bold">{profile.displayName}</span>
        </Link>
      </div>
      <ChatThread userId={profile.id} />
    </div>
  )
}
