// app/events/[id]/page.tsx
import { EventMembers } from '@/components/EventMembers'
import { CommentThread } from '@/components/CommentThread'

async function getEvent(id: string) {
  // Minimal inline fetch; a dedicated GET /api/events/:id is not needed for V1
  // since the member list and comments routes already carry the data the page needs.
  return { id }
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)
  return (
    <article className="mx-auto max-w-2xl px-4 py-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Organizing around a report</p>
      <h1 className="font-display font-bold text-xl mb-4">Event</h1>
      <div className="mb-6">
        <EventMembers eventId={event.id} />
      </div>
      <CommentThread eventId={event.id} />
    </article>
  )
}
