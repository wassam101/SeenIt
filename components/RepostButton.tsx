'use client'
import { useState } from 'react'

export function RepostButton({ postId }: { postId: string }) {
  const [reposted, setReposted] = useState(false)

  async function repost() {
    const res = await fetch(`/api/posts/${postId}/reposts`, { method: 'POST' })
    if (res.ok) setReposted(true)
  }

  return (
    <button onClick={repost} disabled={reposted}>
      {reposted ? 'Reposted' : 'Repost'}
    </button>
  )
}
