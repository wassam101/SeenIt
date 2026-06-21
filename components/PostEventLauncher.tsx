'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StartEventForm } from './StartEventForm'

export function PostEventLauncher({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  if (!open) {
    return <button onClick={() => setOpen(true)}>Start event</button>
  }

  return <StartEventForm postId={postId} onCreated={(eventId) => router.push(`/events/${eventId}`)} />
}
