'use client'
import { useEffect, useState } from 'react'
import { useCurrentLocation } from '@/lib/location/use-current-location'
import { PostCard } from './PostCard'

type Post = { id: string; authorName: string; thumbnailUrl: string | null; caption: string | null; createdAt: string }

export function FeedTabs() {
  const [tab, setTab] = useState<'global' | 'nearby'>('global')
  const [posts, setPosts] = useState<Post[]>([])
  const location = useCurrentLocation()

  useEffect(() => {
    if (tab === 'nearby' && !location) return
    const params = new URLSearchParams({ mode: tab })
    if (tab === 'nearby' && location) {
      params.set('lat', String(location.lat))
      params.set('lng', String(location.lng))
    }
    fetch(`/api/feed?${params}`)
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
  }, [tab, location])

  return (
    <div>
      <nav className="flex gap-1 mb-5 font-mono text-xs uppercase tracking-wider">
        <button
          onClick={() => setTab('global')}
          aria-pressed={tab === 'global'}
          className={`px-3 py-1.5 border transition-colors ${
            tab === 'global'
              ? 'bg-ink text-paper border-ink'
              : 'border-evidence text-slate hover:border-ink hover:text-ink'
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setTab('nearby')}
          aria-pressed={tab === 'nearby'}
          className={`px-3 py-1.5 border transition-colors ${
            tab === 'nearby'
              ? 'bg-ink text-paper border-ink'
              : 'border-evidence text-slate hover:border-ink hover:text-ink'
          }`}
        >
          Nearby
        </button>
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
    </div>
  )
}
