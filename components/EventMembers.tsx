'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type Member = { userId: string; displayName: string; joinedAt: string }

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
    <section>
      <button onClick={join} disabled={joined}>
        {joined ? 'Joined' : 'Join event'}
      </button>
      <ul>
        {members.map((m) => (
          <li key={m.userId}>{m.displayName}</li>
        ))}
      </ul>
    </section>
  )
}
