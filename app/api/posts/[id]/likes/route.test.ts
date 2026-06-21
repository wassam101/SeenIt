import { describe, it, expect, vi } from 'vitest'
import { POST, DELETE } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'u1', email: 'a@example.com' })),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () => ({
      upsert: async () => ({ error: null }),
      delete: () => ({
        eq: () => ({ eq: async () => ({ error: null }) }),
      }),
    }),
  }),
}))

describe('like routes', () => {
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
