// app/api/feed/route.test.ts
import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

const calls: any[] = []
function chain(rows: any[]) {
  const builder: any = {
    select: () => builder,
    eq: (...args: any[]) => { calls.push(['eq', ...args]); return builder },
    is: (...args: any[]) => { calls.push(['is', ...args]); return builder },
    gte: (...args: any[]) => { calls.push(['gte', ...args]); return builder },
    lte: (...args: any[]) => { calls.push(['lte', ...args]); return builder },
    order: (...args: any[]) => { calls.push(['order', ...args]); return builder },
    limit: async () => ({ data: rows, error: null }),
  }
  return builder
}

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () =>
      chain([
        {
          id: 'post-1',
          caption: 'hi',
          thumbnail_url: 'https://thumb.example/1.jpg',
          created_at: '2026-01-01T00:00:00Z',
          profiles: { display_name: 'Alice' },
        },
      ]),
  }),
}))

describe('GET /api/feed', () => {
  it('returns posts for global mode', async () => {
    const res = await GET(new Request('http://localhost/api/feed?mode=global'))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.posts).toHaveLength(1)
    expect(json.posts[0]).toMatchObject({ id: 'post-1', authorName: 'Alice' })
  })

  it('requires lat/lng for nearby mode', async () => {
    const res = await GET(new Request('http://localhost/api/feed?mode=nearby'))
    expect(res.status).toBe(400)
  })
})
