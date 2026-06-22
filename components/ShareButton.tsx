'use client'
import { useState } from 'react'
import { ShareIcon } from '@/components/icons/Share'

export function ShareButton({ postId }: { postId: string }) {
  const [shared, setShared] = useState(false)

  async function share() {
    const res = await fetch(`/api/posts/${postId}/reposts`, { method: 'POST' })
    if (res.ok) setShared(true)
  }

  return (
    <button
      onClick={share}
      disabled={shared}
      className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors disabled:cursor-default ${
        shared
          ? 'bg-ink text-paper border-ink'
          : 'border-evidence text-slate hover:border-ink hover:text-ink'
      }`}
    >
      <ShareIcon className="h-3.5 w-3.5" />
      {shared ? 'Shared' : 'Share'}
    </button>
  )
}
