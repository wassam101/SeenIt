'use client'
import { useEffect, useState } from 'react'

type Member = { userId: string; displayName: string; joinedAt: string }

export function EventMembers({ eventId }: { eventId: string }) {
  const [members, setMembers] = useState<Member[]>([])
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    fetch(`/api/events/${eventId}/members`).then((res) => res.json()).then((data) => setMembers(data.members))
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
