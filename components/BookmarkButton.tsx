'use client'
import { useState } from 'react'
import { BookmarkIcon } from '@/components/icons/Bookmark'

export function BookmarkButton({ postId, initiallySaved = false }: { postId: string; initiallySaved?: boolean }) {
  const [saved, setSaved] = useState(initiallySaved)

  async function toggle() {
    const method = saved ? 'DELETE' : 'POST'
    const res = await fetch(`/api/posts/${postId}/saves`, { method })
    if (res.ok) {
      const json = await res.json()
      setSaved(json.saved)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from library' : 'Save to library'}
      title={saved ? 'Saved' : 'Save'}
      className={`transition-colors ${saved ? 'text-teal' : 'text-slate hover:text-teal'}`}
    >
      <BookmarkIcon className="h-5 w-5" filled={saved} />
    </button>
  )
}
