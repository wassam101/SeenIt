'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCurrentLocation } from '@/lib/location/use-current-location'
import { PostCard } from './PostCard'

type Post = {
  id: string
  authorId?: string | null
  authorName: string
  authorAvatarUrl: string | null
  thumbnailUrl: string | null
  caption: string | null
  createdAt: string
  locationLabel?: string | null
}

const RADIUS_OPTIONS_KM = [1, 5, 10, 20, 50, 100]

export function FeedTabs() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'global' | 'nearby'>(searchParams.get('feed') === 'nearby' ? 'nearby' : 'global')
  const [radiusKm, setRadiusKm] = useState(10)
  const [posts, setPosts] = useState<Post[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const location = useCurrentLocation()
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Syncs the tab when navigated to via a link carrying ?feed=nearby
    // (e.g. the sidebar's Nearby item) rather than clicking the tab itself,
    // since useState's initializer only runs on the first mount.
    setTab(searchParams.get('feed') === 'nearby' ? 'nearby' : 'global')
  }, [searchParams])

  function buildParams(cursor?: string) {
    const params = new URLSearchParams({ mode: tab })
    if (tab === 'nearby' && location) {
      params.set('lat', String(location.lat))
      params.set('lng', String(location.lng))
      params.set('radiusKm', String(radiusKm))
    }
    if (cursor) params.set('cursor', cursor)
    return params
  }

  useEffect(() => {
    if (tab === 'nearby' && !location) return
    fetch(`/api/feed?${buildParams()}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts)
        setNextCursor(data.nextCursor)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, location, radiusKm])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !nextCursor) return

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || loadingMore) return
      setLoadingMore(true)
      fetch(`/api/feed?${buildParams(nextCursor)}`)
        .then((res) => res.json())
        .then((data) => {
          setPosts((prev) => [...prev, ...data.posts])
          setNextCursor(data.nextCursor)
        })
        .finally(() => setLoadingMore(false))
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextCursor, tab, location, radiusKm, loadingMore])

  return (
    <div>
      <nav className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-1 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setTab('global')}
            aria-pressed={tab === 'global'}
            className={`px-3 py-1.5 transition-colors ${
              tab === 'global' ? 'bg-teal text-paper' : 'text-slate hover:text-ink'
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setTab('nearby')}
            aria-pressed={tab === 'nearby'}
            className={`px-3 py-1.5 transition-colors ${
              tab === 'nearby' ? 'bg-teal text-paper' : 'text-slate hover:text-ink'
            }`}
          >
            Nearby
          </button>
        </div>
        {tab === 'nearby' && (
          <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate">
            Within
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="border border-evidence bg-white px-2 py-1.5 text-ink focus-visible:border-ink"
            >
              {RADIUS_OPTIONS_KM.map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
          </label>
        )}
      </nav>
      {tab === 'nearby' && !location && (
        <p className="font-mono text-xs text-slate border border-dashed border-evidence px-3 py-3 mb-4">
          Allow location access, or set your location manually, to see nearby posts.
        </p>
      )}
      {posts.length === 0 ? (
        <p className="font-mono text-xs text-slate border border-dashed border-evidence px-3 py-6 text-center">
          No reports yet. Be the first to post what you saw.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
      {nextCursor && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}
      {loadingMore && (
        <p className="font-mono text-xs text-slate text-center py-4">Loading more&hellip;</p>
      )}
    </div>
  )
}
