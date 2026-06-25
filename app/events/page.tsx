// app/events/page.tsx
import { cookies } from 'next/headers'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/time'

async function getEvents() {
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/events`, {
    cache: 'no-store',
    headers: { cookie: cookieHeader },
  })
  if (!res.ok) return []
  const json = await res.json()
  return json.events as {
    id: string
    title: string
    type: 'discussion' | 'action'
    eventDatetime: string | null
    locationLabel: string | null
    createdAt: string
  }[]
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Organizing</p>
      <h1 className="font-display font-bold text-2xl mb-6">Events &amp; discussions</h1>
      {events.length === 0 ? (
        <p className="font-mono text-xs text-slate border border-dashed border-evidence px-3 py-6 text-center">
          You haven&apos;t started or joined any events yet. Start one from a post.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/events/${event.id}`}
                className="block border border-evidence bg-paper/40 hover:bg-paper transition-colors px-4 py-3"
              >
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate">
                  {event.type === 'action' ? 'Action' : 'Discussion'} · {formatRelativeTime(event.createdAt)}
                </p>
                <p className="font-display font-bold text-base mt-1">{event.title}</p>
                {event.locationLabel && <p className="font-mono text-xs text-slate mt-1">{event.locationLabel}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
