'use client'
import { useState } from 'react'
import { EyeIcon } from '@/components/icons/Eye'

export function SeenItButton({
  postId,
  initiallySeen,
  initialCount = 0,
}: {
  postId: string
  initiallySeen: boolean
  initialCount?: number
}) {
  const [seen, setSeen] = useState(initiallySeen)
  const [count, setCount] = useState(initialCount)
  const [justBlinked, setJustBlinked] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [likerNames, setLikerNames] = useState<string[] | null>(null)

  async function toggle() {
    const method = seen ? 'DELETE' : 'POST'
    const res = await fetch(`/api/posts/${postId}/likes`, { method })
    if (res.ok) {
      const json = await res.json()
      setSeen(json.liked)
      setCount((c) => c + (json.liked ? 1 : -1))
      setJustBlinked(true)
      setTimeout(() => setJustBlinked(false), 400)
      setLikerNames(null)
    }
  }

  async function handleMouseEnter() {
    setShowTooltip(true)
    if (likerNames !== null) return
    const res = await fetch(`/api/posts/${postId}/likes`)
    if (res.ok) {
      const json = await res.json()
      setLikerNames(json.likers.map((liker: { name: string }) => liker.name))
    }
  }

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={() => setShowTooltip(false)}>
      <button
        onClick={toggle}
        aria-pressed={seen}
        aria-label={seen ? 'Seen' : 'SeenIt'}
        className={`flex items-center gap-1.5 font-sans text-sm transition-colors ${
          seen ? 'text-signal' : 'text-slate hover:text-signal'
        }`}
      >
        <EyeIcon open={seen} className={`h-5 w-9 ${justBlinked ? 'eye-blink-once' : ''}`} />
        {count > 0 && <span>{count}</span>}
      </button>
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute left-0 bottom-full mb-1 z-10 whitespace-nowrap bg-black text-white font-sans text-sm px-2.5 py-1.5 shadow-sm"
        >
          {likerNames === null ? '…' : likerNames.length === 0 ? 'No one yet' : likerNames.join(', ')}
        </div>
      )}
    </div>
  )
}
