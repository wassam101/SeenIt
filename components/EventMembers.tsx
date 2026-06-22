'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Avatar } from '@/components/Avatar'

type Member = { userId: string; displayName: string; avatarUrl?: string | null; joinedAt: string }

export function EventMembers({ eventId }: { eventId: string }) {
  const [members, setMembers] = useState<Member[]>([])
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    // Use createBrowserClient directly (rather than the shared getEnv() helper)
    // since only NEXT_PUBLIC_* vars are available in the browser bundle.
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    Promise.all([
      fetch(`/api/events/${eventId}/members`).then((res) => res.json()),
      supabase.auth.getUser(),
    ]).then(([data, { data: userData }]) => {
      setMembers(data.members)
      if (userData.user && data.members.some((m: Member) => m.userId === userData.user!.id)) {
        setJoined(true)
      }
    })
  }, [eventId])

  async function join() {
    const res = await fetch(`/api/events/${eventId}/members`, { method: 'POST' })
    if (res.ok) setJoined(true)
  }

  return (
    <section className="border-2 border-dashed border-caution bg-caution/10 px-4 py-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-3">
        {members.length} {members.length === 1 ? 'person' : 'people'} organizing
      </p>
      <button
        onClick={join}
        disabled={joined}
        className={`font-mono text-xs uppercase tracking-wider px-4 py-2 transition-colors disabled:cursor-default ${
          joined ? 'bg-ink text-paper' : 'bg-signal text-paper hover:bg-ink'
        }`}
      >
        {joined ? '✓ Joined' : 'Join event'}
      </button>
      <ul className="flex flex-col gap-2 mt-3 text-sm">
        {members.map((m) => (
          <li key={m.userId}>
            <Link href={`/u/${m.userId}`} className="flex items-center gap-2 hover:text-teal w-fit">
              <Avatar name={m.displayName} avatarUrl={m.avatarUrl} size={20} />
              {m.displayName}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
