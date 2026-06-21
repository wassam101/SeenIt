// app/api/posts/[id]/comments/route.test.ts
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'u1', email: 'a@example.com' })),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          is: () => ({
            order: async () => ({
              data: [{ id: 'c1', body: 'nice', created_at: '2026-01-01T00:00:00Z', profiles: { display_name: 'Alice' } }],
              error: null,
            }),
          }),
        }),
      }),
      insert: (row: any) => ({
        select: () => ({
          single: async () => ({
            data: { id: 'c2', body: row.body, created_at: '2026-01-02T00:00:00Z' },
            error: null,
          }),
        }),
      }),
    }),
  }),
}))

describe('comments routes', () => {
  it('GET lists comments for a post', async () => {
    const res = await GET(new Request('http://localhost/api/posts/post-1/comments'), { params: { id: 'post-1' } })
    const json = await res.json()
    expect(json.comments).toEqual([{ id: 'c1', authorName: 'Alice', body: 'nice', createdAt: '2026-01-01T00:00:00Z' }])
  })

  it('POST requires a non-empty body', async () => {
    const res = await POST(
      new Request('http://localhost/api/posts/post-1/comments', { method: 'POST', body: JSON.stringify({ body: '' }) }),
      { params: { id: 'post-1' } }
    )
    expect(res.status).toBe(400)
  })

  it('POST creates a comment', async () => {
    const res = await POST(
      new Request('http://localhost/api/posts/post-1/comments', { method: 'POST', body: JSON.stringify({ body: 'great post' }) }),
      { params: { id: 'post-1' } }
    )
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.body).toBe('great post')
  })
})
