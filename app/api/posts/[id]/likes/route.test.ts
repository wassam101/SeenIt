import { describe, it, expect, vi } from 'vitest'
import { GET, POST, DELETE } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'u1', email: 'a@example.com' })),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: async () => ({
              data: [
                { user_id: 'u-alice', profiles: { display_name: 'Alice', is_anonymous: false } },
                { user_id: 'u-anon', profiles: { display_name: 'Bob', is_anonymous: true } },
              ],
              error: null,
            }),
          }),
        }),
      }),
      upsert: async () => ({ error: null }),
      delete: () => ({
        eq: () => ({ eq: async () => ({ error: null }) }),
      }),
    }),
  }),
}))

describe('like routes', () => {
  it('GET lists who liked a post, respecting anonymity', async () => {
    const res = await GET(new Request('http://localhost/api/posts/post-1/likes'), { params: { id: 'post-1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.likers).toEqual([{ name: 'Alice' }, { name: 'Anonymous' }])
  })

  it('POST likes a post idempotently', async () => {
    const res = await POST(new Request('http://localhost/api/posts/post-1/likes'), { params: { id: 'post-1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toEqual({ liked: true })
  })

  it('DELETE unlikes a post', async () => {
    const res = await DELETE(new Request('http://localhost/api/posts/post-1/likes'), { params: { id: 'post-1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toEqual({ liked: false })
  })
})
