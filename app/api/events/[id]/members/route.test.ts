import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'u2', email: 'b@example.com' })),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: async () => ({
            data: [{ user_id: 'u1', joined_at: '2026-01-01T00:00:00Z', profiles: { display_name: 'Alice' } }],
            error: null,
          }),
        }),
      }),
      upsert: async () => ({ error: null }),
    }),
  }),
}))

describe('event members routes', () => {
  it('GET lists members', async () => {
    const res = await GET(new Request('http://localhost/api/events/event-1/members'), { params: { id: 'event-1' } })
    const json = await res.json()
    expect(json.members).toEqual([{ userId: 'u1', displayName: 'Alice', joinedAt: '2026-01-01T00:00:00Z' }])
  })

  it('POST joins the event idempotently', async () => {
    const res = await POST(new Request('http://localhost/api/events/event-1/members'), { params: { id: 'event-1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toEqual({ joined: true })
  })
})
