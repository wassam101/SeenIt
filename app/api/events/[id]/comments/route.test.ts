// app/api/events/[id]/comments/route.test.ts
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
              data: [{ id: 'c1', body: 'count me in', created_at: '2026-01-01T00:00:00Z', profiles: { display_name: 'Alice' } }],
              error: null,
            }),
          }),
        }),
      }),
      insert: (row: any) => ({
        select: () => ({
          single: async () => ({ data: { id: 'c2', body: row.body, created_at: '2026-01-02T00:00:00Z' }, error: null }),
        }),
      }),
    }),
  }),
}))

describe('event comments routes', () => {
  it('GET lists comments for an event', async () => {
    const res = await GET(new Request('http://localhost/api/events/event-1/comments'), { params: { id: 'event-1' } })
    const json = await res.json()
    expect(json.comments).toEqual([{ id: 'c1', authorName: 'Alice', body: 'count me in', createdAt: '2026-01-01T00:00:00Z' }])
  })

  it('POST creates an event comment', async () => {
    const res = await POST(
      new Request('http://localhost/api/events/event-1/comments', { method: 'POST', body: JSON.stringify({ body: 'see you there' }) }),
      { params: { id: 'event-1' } }
    )
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.body).toBe('see you there')
  })
})
