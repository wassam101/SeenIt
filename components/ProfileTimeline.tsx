'use client'
import { useEffect, useRef, useState } from 'react'
import { PostCard } from './PostCard'

type Post = {
  id: string
  authorName: string
  authorAvatarUrl: string | null
  thumbnailUrl: string | null
  caption: string | null
  createdAt: string
  locationLabel?: string | null
}

export function ProfileTimeline({
  userId,
  initialPosts,
  initialNextCursor,
}: {
  userId: string
  initialPosts: Post[]
  initialNextCursor: string | null
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [nextCursor, setNextCursor] = useState(initialNextCursor)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !nextCursor) return

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || loadingMore) return
      setLoadingMore(true)
      fetch(`/api/users/${userId}?cursor=${encodeURIComponent(nextCursor)}`)
        .then((res) => res.json())
        .then((data) => {
          setPosts((prev) => [...prev, ...data.posts])
          setNextCursor(data.nextPostsCursor)
        })
        .finally(() => setLoadingMore(false))
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [nextCursor, userId, loadingMore])

  if (posts.length === 0) {
    return (
      <p className="font-sans text-sm text-slate border border-dashed border-evidence px-3 py-6 text-center">
        No reports yet.
      </p>
    )
  }

  return (
    <>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      {nextCursor && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}
      {loadingMore && <p className="font-sans text-sm text-slate text-center py-4">Loading more&hellip;</p>}
    </>
  )
}
