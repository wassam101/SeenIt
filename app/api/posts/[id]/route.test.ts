// app/api/posts/[id]/route.test.ts
import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    auth: { getUser: async () => ({ data: { user: null } }) },
    from: () => ({
      select: () => ({
        eq: () => ({
          is: () => ({
            single: async () => ({
              data: {
                id: 'post-1',
                author_id: 'u1',
                profiles: { display_name: 'Alice' },
                video_id: 'cf-video-1',
                thumbnail_url: 'https://thumb.example/1.jpg',
                caption: 'hi',
                lat: 1,
                lng: 2,
                location_label: 'Main St',
                status: 'ready',
                created_at: '2026-01-01T00:00:00Z',
                likes: [{ count: 3 }],
                comments: [{ count: 5 }],
              },
              error: null,
            }),
          }),
        }),
      }),
    }),
  }),
}))

describe('GET /api/posts/:id', () => {
  it('returns the post shaped for the client', async () => {
    const res = await GET(new Request('http://localhost/api/posts/post-1'), { params: { id: 'post-1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toMatchObject({ id: 'post-1', authorName: 'Alice', likeCount: 3, commentCount: 5 })
  })
})
