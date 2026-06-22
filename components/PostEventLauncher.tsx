'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StartEventForm } from './StartEventForm'

export function PostEventLauncher({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border-2 border-caution text-ink hover:bg-caution transition-colors"
      >
        ⚠ Start event
      </button>
    )
  }

  return <StartEventForm postId={postId} onCreated={(eventId) => router.push(`/events/${eventId}`)} />
}
