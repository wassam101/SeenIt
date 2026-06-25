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
          eq: () => ({
            maybeSingle: async () => ({ data: { post_id: 'post-1' }, error: null }),
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

describe('save routes', () => {
  it('GET reports whether the current user saved the post', async () => {
    const res = await GET(new Request('http://localhost/api/posts/post-1/saves'), { params: { id: 'post-1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toEqual({ saved: true })
  })

  it('POST saves a post idempotently', async () => {
    const res = await POST(new Request('http://localhost/api/posts/post-1/saves'), { params: { id: 'post-1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toEqual({ saved: true })
  })

  it('DELETE unsaves a post', async () => {
    const res = await DELETE(new Request('http://localhost/api/posts/post-1/saves'), { params: { id: 'post-1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toEqual({ saved: false })
  })
})
