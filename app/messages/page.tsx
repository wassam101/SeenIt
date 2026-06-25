import Link from 'next/link'
import { cookies } from 'next/headers'
import { Avatar } from '@/components/Avatar'
import { formatRelativeTime } from '@/lib/time'

async function getConversations() {
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/messages`, {
    cache: 'no-store',
    headers: { cookie: cookieHeader },
  })
  if (!res.ok) return []
  const json = await res.json()
  return json.conversations
}

export default async function MessagesInboxPage() {
  const conversations = await getConversations()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display font-bold text-3xl leading-snug">Messages</h1>
      <p className="font-sans text-sm text-slate mt-1">Private conversations with people you follow or who follow you.</p>

      <div className="mt-8 border-t border-evidence">
        {conversations.length === 0 ? (
          <p className="font-sans text-sm text-slate border border-dashed border-evidence px-3 py-6 text-center mt-6">
            No conversations yet. Visit someone&apos;s profile and tap Message to start one.
          </p>
        ) : (
          <ul>
            {conversations.map((c: any) => (
              <li key={c.userId} className="border-b border-evidence">
                <Link href={`/messages/${c.userId}`} className="flex items-center gap-3 py-4 hover:bg-evidence/10 transition-colors">
                  <Avatar name={c.displayName} avatarUrl={c.avatarUrl} size={44} />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-[15px] font-semibold text-ink truncate">{c.displayName}</p>
                    <p className="font-sans text-sm text-slate truncate">{c.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-sans text-xs text-slate">{formatRelativeTime(c.lastMessageAt)}</span>
                    {c.unread && <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
