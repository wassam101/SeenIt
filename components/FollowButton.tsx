'use client'
import { useState } from 'react'

export function FollowButton({ userId, initiallyFollowing }: { userId: string; initiallyFollowing: boolean }) {
  const [following, setFollowing] = useState(initiallyFollowing)
  const [pending, setPending] = useState(false)

  async function toggle() {
    setPending(true)
    const method = following ? 'DELETE' : 'POST'
    const res = await fetch(`/api/users/${userId}/follow`, { method })
    if (res.ok) {
      const json = await res.json()
      setFollowing(json.following)
    }
    setPending(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`font-sans text-sm font-semibold rounded-full px-4 py-2 transition-colors disabled:opacity-50 ${
        following ? 'text-signal' : 'text-teal hover:text-signal'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
