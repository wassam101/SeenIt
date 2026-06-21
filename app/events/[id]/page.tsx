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
    <article>
      <EventMembers eventId={event.id} />
      <CommentThread eventId={event.id} />
    </article>
  )
}
