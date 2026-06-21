import { describe, it, expect, vi } from 'vitest'
import { POST } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'u1', email: 'a@example.com' })),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () => ({
      upsert: (_row: any, _opts: any) => Promise.resolve({ error: null }),
    }),
  }),
}))

describe('POST /api/posts/:id/reposts', () => {
  it('creates a repost', async () => {
    const res = await POST(new Request('http://localhost/api/posts/post-1/reposts'), { params: { id: 'post-1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toEqual({ reposted: true })
  })
})
