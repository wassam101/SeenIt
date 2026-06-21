// components/FeedTabs.tsx
'use client'
import { useEffect, useState } from 'react'
import { useCurrentLocation } from '@/lib/location/use-current-location'
import { PostCard } from './PostCard'

type Post = { id: string; authorName: string; thumbnailUrl: string | null; caption: string | null }

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
      <nav>
        <button onClick={() => setTab('global')} aria-pressed={tab === 'global'}>
          Global
        </button>
        <button onClick={() => setTab('nearby')} aria-pressed={tab === 'nearby'}>
          Nearby
        </button>
      </nav>
      {tab === 'nearby' && !location && <p>Allow location access, or set your location manually, to see nearby posts.</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  )
}
