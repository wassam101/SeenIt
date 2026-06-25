'use client'
import { useState } from 'react'
import { RepostIcon } from '@/components/icons/Repost'

export function RepostButton({ postId, initialCount = 0 }: { postId: string; initialCount?: number }) {
  const [reposted, setReposted] = useState(false)
  const [count, setCount] = useState(initialCount)

  async function repost() {
    const res = await fetch(`/api/posts/${postId}/reposts`, { method: 'POST' })
    if (res.ok) {
      setReposted(true)
      setCount((c) => c + 1)
    }
  }

  return (
    <button
      onClick={repost}
      disabled={reposted}
      aria-label={reposted ? 'Reposted' : 'Repost'}
      className={`flex items-center gap-1.5 font-sans text-base font-semibold rounded-full px-2 py-1 -mx-2 -my-1 transition-colors disabled:cursor-default ${
        reposted ? 'text-teal bg-teal/10' : 'text-slate hover:text-teal hover:bg-teal/10'
      }`}
    >
      <RepostIcon className="h-[22px] w-[22px]" />
      {count > 0 && <span>{count}</span>}
    </button>
  )
}
