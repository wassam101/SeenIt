'use client'
import { useState } from 'react'
import { EyeIcon } from '@/components/icons/Eye'

export function SeenItButton({ postId, initiallySeen }: { postId: string; initiallySeen: boolean }) {
  const [seen, setSeen] = useState(initiallySeen)
  const [justBlinked, setJustBlinked] = useState(false)

  async function toggle() {
    const method = seen ? 'DELETE' : 'POST'
    const res = await fetch(`/api/posts/${postId}/likes`, { method })
    if (res.ok) {
      const json = await res.json()
      setSeen(json.liked)
      setJustBlinked(true)
      setTimeout(() => setJustBlinked(false), 400)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={seen}
      className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3 py-1.5 transition-colors ${
        seen ? 'text-signal' : 'text-teal hover:text-signal'
      }`}
    >
      <EyeIcon open={seen} className={`h-3.5 w-6 ${justBlinked ? 'eye-blink-once' : ''}`} />
      {seen ? 'Seen' : 'SeenIt'}
    </button>
  )
}
