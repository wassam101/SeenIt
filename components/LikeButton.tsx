'use client'
import { useState } from 'react'

export function LikeButton({ postId, initiallyLiked }: { postId: string; initiallyLiked: boolean }) {
  const [liked, setLiked] = useState(initiallyLiked)

  async function toggle() {
    const method = liked ? 'DELETE' : 'POST'
    const res = await fetch(`/api/posts/${postId}/likes`, { method })
    if (res.ok) {
      const json = await res.json()
      setLiked(json.liked)
    }
  }

  return (
    <button onClick={toggle} aria-pressed={liked}>
      {liked ? 'Liked' : 'Like'}
    </button>
  )
}
